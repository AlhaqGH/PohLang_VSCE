import * as vscode from 'vscode';
import { spawnPohLangProcess } from '../utils/processUtils';
import { ensureSDKsUpToDate } from '../utils/fetchLatestSDKs';
import * as path from 'path';

export async function runFile(uri?: vscode.Uri): Promise<void> {
    try {
        // Get the current file URI
        let fileUri: vscode.Uri;
        
        if (uri) {
            fileUri = uri;
        } else if (vscode.window.activeTextEditor) {
            fileUri = vscode.window.activeTextEditor.document.uri;
        } else {
            vscode.window.showErrorMessage('No .poh file is currently open');
            return;
        }

        // Check if it's a .poh file
        if (!fileUri.fsPath.endsWith('.poh')) {
            vscode.window.showErrorMessage('The selected file is not a .poh file');
            return;
        }

        // Ensure SDKs are up to date before running
        const ext = vscode.extensions.getExtension('pohlang.pohlang-hub');
        const context: vscode.ExtensionContext | undefined = (ext as any)?.exports?.context;
        if (context) {
            await ensureSDKsUpToDate(context);
        }

        // Show information message
        vscode.window.showInformationMessage(`Running PohLang file: ${path.basename(fileUri.fsPath)}`);

        // Create or show output channel
        const outputChannel = vscode.window.createOutputChannel('PohLang Output');
        outputChannel.show();
        outputChannel.clear();
        
        outputChannel.appendLine(`Running: ${fileUri.fsPath}`);
        outputChannel.appendLine('---');

        // Run the file using the PohLang interpreter
        const result = await spawnPohLangProcess(fileUri.fsPath);
        
        if (result.success) {
            outputChannel.appendLine(result.stdout);
            if (result.stderr) {
                outputChannel.appendLine('Warnings:');
                outputChannel.appendLine(result.stderr);
            }
            vscode.window.showInformationMessage('PohLang file executed successfully');
        } else {
            outputChannel.appendLine('Error executing PohLang file:');
            outputChannel.appendLine(result.stderr || result.stdout);
            vscode.window.showErrorMessage('Failed to execute PohLang file. Check output for details.');
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Error running PohLang file: ${errorMessage}`);
    }
}