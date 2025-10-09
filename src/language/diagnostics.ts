import * as vscode from 'vscode';
import { spawnPohLangProcess } from '../utils/processUtils';

export class PohLangDiagnostics {
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor(context: vscode.ExtensionContext) {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('pohlang');
        context.subscriptions.push(this.diagnosticCollection);

        // Register event listeners
        vscode.workspace.onDidChangeTextDocument(this.onDocumentChange, this, context.subscriptions);
        vscode.workspace.onDidOpenTextDocument(this.onDocumentOpen, this, context.subscriptions);
    }

    private onDocumentChange(event: vscode.TextDocumentChangeEvent): void {
        if (event.document.languageId === 'pohlang') {
            this.updateDiagnostics(event.document.uri);
        }
    }

    private onDocumentOpen(document: vscode.TextDocument): void {
        if (document.languageId === 'pohlang') {
            this.updateDiagnostics(document.uri);
        }
    }

    public async updateDiagnostics(uri: vscode.Uri): Promise<void> {
        const document = await vscode.workspace.openTextDocument(uri);
        if (document.languageId !== 'pohlang') {
            return;
        }

        const diagnostics: vscode.Diagnostic[] = [];

        try {
            // Basic syntax validation
            const syntaxErrors = this.validateSyntax(document);
            diagnostics.push(...syntaxErrors);

            // Try to run syntax check with interpreter (if available)
            const interpreterErrors = await this.validateWithInterpreter(uri.fsPath);
            diagnostics.push(...interpreterErrors);

        } catch (error) {
            // If interpreter validation fails, that's okay - we'll just use basic validation
        }

        this.diagnosticCollection.set(uri, diagnostics);
    }

    private validateSyntax(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const lines = text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i;

            // Skip empty lines and comments
            if (!line || line.startsWith('#')) {
                continue;
            }

            // Check for common syntax issues
            this.checkFunctionDefinition(line, lineNumber, diagnostics);
            this.checkVariableAssignment(line, lineNumber, diagnostics);
            this.checkControlStructures(line, lineNumber, diagnostics);
            this.checkStringQuotes(line, lineNumber, diagnostics);
        }

        return diagnostics;
    }

    private checkFunctionDefinition(line: string, lineNumber: number, diagnostics: vscode.Diagnostic[]): void {
        const functionRegex = /^(make\s+function\s+\w+:|function\s+\w+:)/;
        if (line.includes('function') && !functionRegex.test(line)) {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(lineNumber, 0, lineNumber, line.length),
                'Invalid function definition. Use "make function name:" or "function name:"',
                vscode.DiagnosticSeverity.Error
            );
            diagnostics.push(diagnostic);
        }
    }

    private checkVariableAssignment(line: string, lineNumber: number, diagnostics: vscode.Diagnostic[]): void {
        if (line.includes('set') && !line.includes('to')) {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(lineNumber, 0, lineNumber, line.length),
                'Variable assignment should use "set variable to value" syntax',
                vscode.DiagnosticSeverity.Warning
            );
            diagnostics.push(diagnostic);
        }
    }

    private checkControlStructures(line: string, lineNumber: number, diagnostics: vscode.Diagnostic[]): void {
        const controlKeywords = ['if', 'while', 'for'];
        for (const keyword of controlKeywords) {
            if (line.startsWith(keyword) && !line.endsWith(':')) {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(lineNumber, 0, lineNumber, line.length),
                    `${keyword} statement should end with a colon (:)`,
                    vscode.DiagnosticSeverity.Error
                );
                diagnostics.push(diagnostic);
            }
        }
    }

    private checkStringQuotes(line: string, lineNumber: number, diagnostics: vscode.Diagnostic[]): void {
        // Check for unmatched quotes
        const singleQuotes = (line.match(/'/g) || []).length;
        const doubleQuotes = (line.match(/"/g) || []).length;

        if (singleQuotes % 2 !== 0) {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(lineNumber, 0, lineNumber, line.length),
                'Unmatched single quote',
                vscode.DiagnosticSeverity.Error
            );
            diagnostics.push(diagnostic);
        }

        if (doubleQuotes % 2 !== 0) {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(lineNumber, 0, lineNumber, line.length),
                'Unmatched double quote',
                vscode.DiagnosticSeverity.Error
            );
            diagnostics.push(diagnostic);
        }
    }

    private async validateWithInterpreter(filePath: string): Promise<vscode.Diagnostic[]> {
        const diagnostics: vscode.Diagnostic[] = [];

        try {
            // Try to run syntax check with the interpreter
            const result = await spawnPohLangProcess(filePath, ['--syntax-check']);
            
            if (!result.success && result.stderr) {
                // Parse interpreter error messages
                const errorMessages = this.parseInterpreterErrors(result.stderr);
                diagnostics.push(...errorMessages);
            }
        } catch (error) {
            // Interpreter not available or failed - ignore
        }

        return diagnostics;
    }

    private parseInterpreterErrors(errorOutput: string): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const lines = errorOutput.split('\n');

        for (const line of lines) {
            // Parse error format: "Line X: Error message"
            const match = line.match(/Line (\d+):\s*(.+)/);
            if (match) {
                const lineNumber = parseInt(match[1]) - 1; // Convert to 0-based
                const message = match[2];
                
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(lineNumber, 0, lineNumber, Number.MAX_SAFE_INTEGER),
                    message,
                    vscode.DiagnosticSeverity.Error
                );
                diagnostics.push(diagnostic);
            }
        }

        return diagnostics;
    }

    public dispose(): void {
        this.diagnosticCollection.dispose();
    }
}