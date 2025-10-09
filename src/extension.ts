import * as vscode from 'vscode';
import { runFile } from './commands/runFile';
import { createProject } from './commands/createProject';
import { updateLanguage } from './commands/updateLanguage';
import { PohLangDiagnostics } from './language/diagnostics';
import { PohLangCompletionProvider } from './language/completion';
import { runEnvironmentExample } from './commands/runEnvironmentExample';
import { showSDKVersions } from './commands/showSDKVersions';

let diagnostics: PohLangDiagnostics;
export let extensionContext: vscode.ExtensionContext;

export function activate(context: vscode.ExtensionContext) {
    extensionContext = context;
    console.log('PohLang Hub extension is now active!');

    // Initialize diagnostics provider
    diagnostics = new PohLangDiagnostics(context);

    // Register completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        'pohlang',
        new PohLangCompletionProvider(),
        '.',
        ' '
    );

    // Register commands
    const runFileCommand = vscode.commands.registerCommand('pohlang-hub.runFile', (uri?: vscode.Uri) => {
        runFile(uri);
    });

    const createProjectCommand = vscode.commands.registerCommand('pohlang-hub.createProject', () => {
        createProject();
    });

    const updateLanguageCommand = vscode.commands.registerCommand('pohlang-hub.updateLanguage', () => {
        updateLanguage();
    });

    const runEnvExampleCommand = vscode.commands.registerCommand('pohlang-hub.runEnvironmentExample', () => {
        runEnvironmentExample();
    });

    const showSDKVersionsCommand = vscode.commands.registerCommand('pohlang-hub.showSDKVersions', () => {
        showSDKVersions();
    });

    // Add to subscriptions
    context.subscriptions.push(
        runFileCommand,
        createProjectCommand,
        updateLanguageCommand,
        runEnvExampleCommand,
        showSDKVersionsCommand,
        completionProvider,
        diagnostics
    );

    // Register file change listener for .poh files
    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.poh');
    
    fileWatcher.onDidChange((uri) => {
        diagnostics.updateDiagnostics(uri);
    });
    
    fileWatcher.onDidCreate((uri) => {
        diagnostics.updateDiagnostics(uri);
    });

    context.subscriptions.push(fileWatcher);

    // Show activation message
    vscode.window.showInformationMessage('PohLang Hub extension activated! Ready to work with .poh files.');

    // Expose context for internal utilities that need extensionPath
    return { context };
}

export function deactivate() {
    console.log('PohLang Hub extension is deactivated');
}