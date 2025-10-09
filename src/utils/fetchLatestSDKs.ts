import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as https from 'https';
import { pipeline } from 'stream';
import { promisify } from 'util';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const extract = require('extract-zip') as (zipPath: string, opts: { dir: string }) => Promise<void>;

const streamPipeline = promisify(pipeline);

export interface SDKVersions {
    pohlang?: { tag: string; version: string; asset?: string };
    plhub?: { tag: string; version: string; asset?: string };
    fetchedAt: string;
}

interface ReleaseInfo {
    tag_name: string;
    name?: string;
    assets: Array<{ name: string; browser_download_url: string; size: number }>;
}

interface RepoSpec {
    owner: string;
    repo: string;
}

const DEFAULT_POHLANG_REPO: RepoSpec = { owner: 'AlhaqGH', repo: 'PohLang' };
const DEFAULT_PLHUB_REPO: RepoSpec = { owner: 'AlhaqGH', repo: 'PLHub' };

function getConfig() {
    const cfg = vscode.workspace.getConfiguration('pohlangHub');
  // Support both old and new keys
  const pohRepoStr = cfg.get<string>('pohlangRepo')
    || cfg.get<string>('interpreterRepo')
    || `${DEFAULT_POHLANG_REPO.owner}/${DEFAULT_POHLANG_REPO.repo}`;
  const plRepoStr = cfg.get<string>('plhubRepo')
    || cfg.get<string>('sdkRepo')
    || `${DEFAULT_PLHUB_REPO.owner}/${DEFAULT_PLHUB_REPO.repo}`;
  const pohlangRepo = pohRepoStr.split('/');
  const plhubRepo = plRepoStr.split('/');
  const tagOverride = cfg.get<string>('sdkTagOverride');
  const assetPattern = cfg.get<string>('assetPattern');
  const updateIntervalDays = cfg.get<number>('updateIntervalDays')
    ?? cfg.get<number>('sdkUpdateIntervalDays')
    ?? 7;
  const autoUpdate = cfg.get<boolean>('autoUpdate')
    ?? cfg.get<boolean>('autoUpdateSDKs')
    ?? true;
    return {
        pohlangRepo: { owner: pohlangRepo[0], repo: pohlangRepo[1] } as RepoSpec,
        plhubRepo: { owner: plhubRepo[0], repo: plhubRepo[1] } as RepoSpec,
        tagOverride,
        assetPattern: assetPattern ? new RegExp(assetPattern, 'i') : undefined,
        updateIntervalDays,
        autoUpdate,
    };
}

async function fetchJson<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            headers: {
                'User-Agent': 'pohlang-hub-extension',
                'Accept': 'application/vnd.github+json',
            },
            method: 'GET',
        }, (res) => {
            if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
                reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                return;
            }
            const chunks: Buffer[] = [];
            res.on('data', (d) => chunks.push(d as Buffer));
            res.on('end', () => {
                try {
                    const body = Buffer.concat(chunks).toString('utf8');
                    resolve(JSON.parse(body) as T);
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function downloadFile(url: string, destPath: string): Promise<void> {
    await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: { 'User-Agent': 'pohlang-hub-extension' },
        }, async (res) => {
            try {
                if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
                    reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    return;
                }
                const tmpPath = destPath + '.download';
                const file = fs.createWriteStream(tmpPath);
                await streamPipeline(res, file);
                await fs.promises.rename(tmpPath, destPath);
                resolve();
            } catch (err) {
                reject(err);
            }
        }).on('error', reject);
    });
}

async function getRelease(repo: RepoSpec, tag?: string): Promise<ReleaseInfo> {
    const base = `https://api.github.com/repos/${repo.owner}/${repo.repo}/releases`;
    const url = tag ? `${base}/tags/${encodeURIComponent(tag)}` : `${base}/latest`;
    return fetchJson<ReleaseInfo>(url);
}

function pickAsset(info: ReleaseInfo, pattern?: RegExp): { name: string; url: string } | undefined {
    const assets = info.assets || [];
    const platform = os.platform();
    const arch = os.arch();
    const preferredPatterns: RegExp[] = [];

    if (pattern) preferredPatterns.push(pattern);

    // Try to pick reasonable default by platform
    if (platform === 'win32') preferredPatterns.push(/win.*(x64|amd64).*\.zip$/i, /windows.*\.zip$/i, /\.zip$/i);
    else if (platform === 'darwin') preferredPatterns.push(/mac|darwin.*\.zip$/i, /\.zip$/i, /\.tar\.gz$/i);
    else preferredPatterns.push(/linux.*(x64|amd64).*\.zip$/i, /linux.*\.tar\.gz$/i, /\.zip$/i);

    // Arch hints
    if (arch === 'arm64') preferredPatterns.unshift(/arm64|aarch64/i);

    for (const pat of preferredPatterns) {
        const found = assets.find(a => pat.test(a.name));
        if (found) return { name: found.name, url: found.browser_download_url };
    }
    // Fallback to first zip
    const fallback = assets.find(a => /\.zip$/i.test(a.name));
    if (fallback) return { name: fallback.name, url: fallback.browser_download_url };
    return undefined;
}

async function safeExtract(zipPath: string, destDir: string): Promise<void> {
    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'pohlang-extract-'));
    try {
        await extract(zipPath, { dir: tmpDir });
        // Basic validation: ensure directory has something
        const entries = await fs.promises.readdir(tmpDir);
        if (!entries || entries.length === 0) throw new Error('Archive appears empty.');

        await fs.promises.mkdir(destDir, { recursive: true });

        // Move extracted content into destDir (replace existing files if any)
        for (const entry of entries) {
            const from = path.join(tmpDir, entry);
            const to = path.join(destDir, entry);
            await fs.promises.rm(to, { recursive: true, force: true });
            await fs.promises.rename(from, to);
        }
    } finally {
        // Cleanup
        try { await fs.promises.rm(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
        try { await fs.promises.rm(zipPath, { force: true }); } catch { /* ignore */ }
    }
}

function findBinary(searchDir: string, names: string[]): string | null {
    const entries = fs.readdirSync(searchDir, { withFileTypes: true });
    for (const ent of entries) {
        const full = path.join(searchDir, ent.name);
        if (ent.isDirectory()) {
            const sub = findBinary(full, names);
            if (sub) return sub;
        } else {
            if (names.includes(ent.name)) return full;
        }
    }
    return null;
}

export async function fetchLatestSDKs(context: vscode.ExtensionContext, opts?: { force?: boolean }): Promise<SDKVersions> {
    const { pohlangRepo, plhubRepo, tagOverride, assetPattern, updateIntervalDays, autoUpdate } = getConfig();
    const extensionPath = context.extensionPath;
    const binDir = path.join(extensionPath, 'bin');
    await fs.promises.mkdir(binDir, { recursive: true });

    const versionsPath = path.join(binDir, '.sdk-versions.json');
    let current: SDKVersions | undefined;
    try {
        const raw = await fs.promises.readFile(versionsPath, 'utf8');
        current = JSON.parse(raw) as SDKVersions;
    } catch { /* no-op */ }

    const now = new Date();
    const needsRefresh = (() => {
        if (opts?.force) return true;
        if (!autoUpdate) return false;
        if (!current?.fetchedAt) return true;
        const last = new Date(current.fetchedAt);
        const ageDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
        return ageDays >= updateIntervalDays;
    })();

    if (!needsRefresh) {
        return current!;
    }

    const output = vscode.window.createOutputChannel('PohLang SDK Fetch');
    output.show(true);
    output.appendLine('Fetching latest PohLang and PL-Hub SDKs...');

    // Download PohLang
    const pohlangRel = await getRelease(pohlangRepo, tagOverride);
    const pohlangAsset = pickAsset(pohlangRel, assetPattern);
    if (!pohlangAsset) throw new Error('Could not find suitable PohLang asset to download.');
    const pohZip = path.join(os.tmpdir(), `pohlang-${Date.now()}.zip`);
    output.appendLine(`Downloading PohLang: ${pohlangRel.tag_name} / ${pohlangAsset.name}`);
    await downloadFile(pohlangAsset.url, pohZip);

    // Extract PohLang into bin/pohlang-dist
    const pohDest = path.join(binDir, 'pohlang-dist');
    await fs.promises.rm(pohDest, { recursive: true, force: true });
    await safeExtract(pohZip, pohDest);

    // Find binary and link/copy to bin/pohlang(.exe)
    const binNames = process.platform === 'win32' ? ['pohlang.exe'] : ['pohlang', 'pohlang.sh'];
    const foundPoh = findBinary(pohDest, binNames);
    if (foundPoh) {
        const targetName = process.platform === 'win32' ? 'pohlang.exe' : 'pohlang';
        const target = path.join(binDir, targetName);
        await fs.promises.rm(target, { force: true });
        await fs.promises.copyFile(foundPoh, target);
        if (process.platform !== 'win32') {
            await fs.promises.chmod(target, 0o755);
        }
    }

    // Download PLHub
    const plhubRel = await getRelease(plhubRepo, tagOverride);
    const plhubAsset = pickAsset(plhubRel, assetPattern);
    if (!plhubAsset) throw new Error('Could not find suitable PL-Hub asset to download.');
    const plZip = path.join(os.tmpdir(), `plhub-${Date.now()}.zip`);
    output.appendLine(`Downloading PL-Hub: ${plhubRel.tag_name} / ${plhubAsset.name}`);
    await downloadFile(plhubAsset.url, plZip);

    // Extract PLHub into bin/plhub-sdk
    const plDest = path.join(binDir, 'plhub-sdk');
    await fs.promises.rm(plDest, { recursive: true, force: true });
    await safeExtract(plZip, plDest);

    const versions: SDKVersions = {
        pohlang: { tag: pohlangRel.tag_name, version: pohlangRel.name || pohlangRel.tag_name, asset: pohlangAsset.name },
        plhub: { tag: plhubRel.tag_name, version: plhubRel.name || plhubRel.tag_name, asset: plhubAsset.name },
        fetchedAt: now.toISOString(),
    };

    await fs.promises.writeFile(versionsPath, JSON.stringify(versions, null, 2), 'utf8');
    output.appendLine('SDKs updated successfully.');
    return versions;
}

export async function ensureSDKsUpToDate(context: vscode.ExtensionContext, opts?: { force?: boolean }): Promise<SDKVersions | undefined> {
    try {
        return await fetchLatestSDKs(context, opts);
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showWarningMessage(`Failed to update SDKs: ${msg}`);
        return undefined;
    }
}

export async function getSDKVersions(context: vscode.ExtensionContext): Promise<SDKVersions | undefined> {
  try {
    const binDir = path.join(context.extensionPath, 'bin');
    const versionsPath = path.join(binDir, '.sdk-versions.json');
    const raw = await fs.promises.readFile(versionsPath, 'utf8');
    return JSON.parse(raw) as SDKVersions;
  } catch {
    return undefined;
  }
}
