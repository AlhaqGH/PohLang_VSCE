import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function createProject(): Promise<void> {
    try {
        // Get the workspace folder or ask user to select a directory
        let workspaceFolder: string;
        
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
        } else {
            const selectedFolder = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select Project Directory'
            });
            
            if (!selectedFolder || selectedFolder.length === 0) {
                return;
            }
            
            workspaceFolder = selectedFolder[0].fsPath;
        }

        // Ask for project name
        const projectName = await vscode.window.showInputBox({
            prompt: 'Enter the name for your PohLang project',
            value: 'my-pohlang-project',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Project name cannot be empty';
                }
                if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                    return 'Project name can only contain letters, numbers, hyphens, and underscores';
                }
                return null;
            }
        });

        if (!projectName) {
            return;
        }

        const projectPath = path.join(workspaceFolder, projectName);

        // Check if directory already exists
        if (fs.existsSync(projectPath)) {
            const overwrite = await vscode.window.showWarningMessage(
                `Directory "${projectName}" already exists. Do you want to continue?`,
                'Yes', 'No'
            );
            
            if (overwrite !== 'Yes') {
                return;
            }
        }

        // Create project directory
        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath, { recursive: true });
        }

        // Create project structure
        const srcPath = path.join(projectPath, 'src');
        if (!fs.existsSync(srcPath)) {
            fs.mkdirSync(srcPath);
        }

        // Create main.poh file
        const mainFilePath = path.join(srcPath, 'main.poh');
        const mainFileContent = `# Welcome to your new PohLang project!
# This is the main entry point for your application.
# PohLang v0.5.2 - Rust Runtime

Start Program
    Write "Hello, PohLang World!"
    Write "Welcome to your new project: ${projectName}"
    
    # Your code goes here
    Make message = "PohLang is awesome!"
    Write message
    
    # Example: Using phrasal expressions
    Make numbers = [1, 2, 3, 4, 5]
    Make sum = total of numbers
    Write "The sum is: "
    Write sum
End Program`;

        fs.writeFileSync(mainFilePath, mainFileContent);

        // Create README.md
        const readmePath = path.join(projectPath, 'README.md');
        const readmeContent = `# ${projectName}

A PohLang project created with PL-Hub.

## Getting Started

1. Open \`src/main.poh\` to start coding
2. Use Ctrl+F5 to run your PohLang files
3. Check the PohLang documentation for language syntax

## Project Structure

- \`src/\` - Source code directory
- \`src/main.poh\` - Main entry point

## Commands

- **PL-Hub: Run File** - Execute the current .poh file
- **PL-Hub: Create Project** - Create a new PohLang project
- **PL-Hub: Update Language** - Update the PohLang interpreter

Happy coding with PohLang!
`;

        fs.writeFileSync(readmePath, readmeContent);

        // Open the project in VS Code
        const projectUri = vscode.Uri.file(projectPath);
        await vscode.commands.executeCommand('vscode.openFolder', projectUri, false);

        vscode.window.showInformationMessage(`PohLang project "${projectName}" created successfully!`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Error creating PohLang project: ${errorMessage}`);
    }
}