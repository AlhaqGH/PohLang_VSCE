import * as vscode from 'vscode';
import { getSDKVersions, ensureSDKsUpToDate } from '../utils/fetchLatestSDKs';

export async function showSDKVersions(): Promise<void> {
    // Try to get extension context to ensure SDKs file location
    const ext = vscode.extensions.getExtension('pohlang.pohlang-hub');
    const context: vscode.ExtensionContext | undefined = (ext as any)?.exports?.context;

    try {
        // Optionally refresh versions if none exist yet
        let versions = context ? await getSDKVersions(context) : undefined;
        if (!versions && context) {
            await ensureSDKsUpToDate(context);
            versions = await getSDKVersions(context);
        }

        if (!versions) {
            vscode.window.showInformationMessage('No SDK versions found yet. Run "PL-Hub: Update Language" to fetch the SDKs.');
            return;
        }

        const lines: string[] = [];
        if (versions.pohlang) {
            lines.push(`PohLang: ${versions.pohlang.version} (${versions.pohlang.tag}) - ${versions.pohlang.asset ?? ''}`.trim());
        } else {
            lines.push('PohLang: not installed');
        }
        if (versions.plhub) {
            lines.push(`PL-Hub: ${versions.plhub.version} (${versions.plhub.tag}) - ${versions.plhub.asset ?? ''}`.trim());
        } else {
            lines.push('PL-Hub: not installed');
        }
        lines.push(`Fetched: ${versions.fetchedAt}`);

        const message = lines.join('\n');
        const output = vscode.window.createOutputChannel('PohLang SDK Versions');
        output.clear();
        output.appendLine(message);
        output.show(true);
        vscode.window.showInformationMessage('Displayed current PohLang/PL-Hub SDK versions in Output.');
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`Failed to read SDK versions: ${msg}`);
    }
}
