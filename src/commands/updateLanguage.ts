import * as vscode from 'vscode';
import { ensureSDKsUpToDate, fetchLatestSDKs } from '../utils/fetchLatestSDKs';

export async function updateLanguage(): Promise<void> {
    const output = vscode.window.createOutputChannel('PohLang Update');
    output.show(true);
    output.appendLine('Updating PohLang interpreter and PL-Hub SDK...');
    try {
        // Use the extension context via the running extension
        const ext = vscode.extensions.getExtension('pohlang.pohlang-hub');
        const context: vscode.ExtensionContext | undefined = (ext as any)?.exports?.context;
        if (!context && ext?.extensionPath) {
            await fetchLatestSDKs({ extensionPath: ext.extensionPath } as unknown as vscode.ExtensionContext, { force: true });
            vscode.window.showInformationMessage('PohLang and PL-Hub SDKs updated.');
            return;
        }
        if (!context) throw new Error('Extension context not available');
        const versions = await ensureSDKsUpToDate(context, { force: true });
        if (versions) {
            output.appendLine(`PohLang: ${versions.pohlang?.tag} (${versions.pohlang?.asset})`);
            output.appendLine(`PL-Hub: ${versions.plhub?.tag} (${versions.plhub?.asset})`);
            vscode.window.showInformationMessage('PohLang and PL-Hub SDKs updated successfully.');
        }
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`Update failed: ${msg}`);
        output.appendLine(`Update failed: ${msg}`);
    }
}
