import * as cp from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';

export interface ProcessResult {
    success: boolean;
    stdout: string;
    stderr: string;
    exitCode: number | null;
}

export async function spawnPohLangProcess(
    filePath: string, 
    args: string[] = []
): Promise<ProcessResult> {
    return new Promise((resolve) => {
        try {
            // Get the interpreter path
            const interpreterPath = getPohLangInterpreterPath();
            
            if (!interpreterPath) {
                resolve({
                    success: false,
                    stdout: '',
                    stderr: 'PohLang interpreter not found. Please update the language using "PL-Hub: Update Language" command.',
                    exitCode: -1
                });
                return;
            }

            // Prepare command arguments with --run flag for Rust runtime v0.5.2
            const allArgs = ['--run', filePath, ...args];
            
            // Spawn the process
                const child = cp.spawn(interpreterPath, allArgs, {
                cwd: path.dirname(filePath),
                env: process.env
            });

            let stdout = '';
            let stderr = '';

            // Collect stdout
                child.stdout?.on('data', (data: Buffer) => {
                stdout += data.toString();
            });

            // Collect stderr
                child.stderr?.on('data', (data: Buffer) => {
                stderr += data.toString();
            });

            // Handle process completion
                child.on('close', (code: number | null) => {
                resolve({
                    success: code === 0,
                    stdout: stdout.trim(),
                    stderr: stderr.trim(),
                    exitCode: code
                });
            });

            // Handle process errors
                child.on('error', (error: Error) => {
                resolve({
                    success: false,
                    stdout: '',
                    stderr: `Failed to start PohLang interpreter: ${error.message}`,
                    exitCode: -1
                });
            });

            // Set a timeout to prevent hanging
            setTimeout(() => {
                    if (!child.killed) {
                        child.kill();
                    resolve({
                        success: false,
                        stdout: stdout.trim(),
                        stderr: 'Process timed out after 30 seconds',
                        exitCode: -1
                    });
                }
            }, 30000); // 30 second timeout

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            resolve({
                success: false,
                stdout: '',
                stderr: `Error executing PohLang interpreter: ${errorMessage}`,
                exitCode: -1
            });
        }
    });
}

export function getPohLangInterpreterPath(): string | null {
    try {
        // Check multiple locations for pohlang.exe (Rust runtime v0.5.2)
        
        // 1. Extension's bin/ directory (bundled with extension)
        const extension = vscode.extensions.getExtension('pohlang.pohlang-hub');
        if (extension) {
            const extensionPath = extension.extensionPath;
            const binDir = path.join(extensionPath, 'bin');
            const candidates = ['pohlang.exe', 'pohlang'];
            
            for (const c of candidates) {
                const full = path.join(binDir, c);
                if (fs.existsSync(full)) {
                    console.log(`Found PohLang runtime at: ${full}`);
                    return full;
                }
            }
        }
        
        // 2. Workspace's bin/ directory (portable distribution)
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            for (const folder of workspaceFolders) {
                const binDir = path.join(folder.uri.fsPath, 'bin');
                if (fs.existsSync(binDir)) {
                    const candidates = ['pohlang.exe', 'pohlang'];
                    for (const c of candidates) {
                        const full = path.join(binDir, c);
                        if (fs.existsSync(full)) {
                            console.log(`Found PohLang runtime at: ${full}`);
                            return full;
                        }
                    }
                }
            }
        }
        
        // 3. Check PohLang/runtime/target/release (development environment)
        if (workspaceFolders && workspaceFolders.length > 0) {
            for (const folder of workspaceFolders) {
                const runtimePath = path.join(folder.uri.fsPath, 'PohLang', 'runtime', 'target', 'release', 'pohlang.exe');
                if (fs.existsSync(runtimePath)) {
                    console.log(`Found PohLang runtime at: ${runtimePath}`);
                    return runtimePath;
                }
                
                // Also try without PohLang subdirectory
                const altRuntimePath = path.join(folder.uri.fsPath, 'runtime', 'target', 'release', 'pohlang.exe');
                if (fs.existsSync(altRuntimePath)) {
                    console.log(`Found PohLang runtime at: ${altRuntimePath}`);
                    return altRuntimePath;
                }
            }
        }
        
        // 4. Check environment PATH
        const pathEnv = process.env.PATH || '';
        const pathDirs = pathEnv.split(path.delimiter);
        
        for (const dir of pathDirs) {
            const candidates = ['pohlang.exe', 'pohlang'];
            for (const c of candidates) {
                const full = path.join(dir, c);
                if (fs.existsSync(full)) {
                    console.log(`Found PohLang runtime at: ${full}`);
                    return full;
                }
            }
        }
        
        console.error('PohLang runtime not found in any expected location');
        return null;
        
    } catch (error) {
        console.error('Error getting PohLang interpreter path:', error);
        return null;
    }
}

export function formatError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    } else if (typeof error === 'string') {
        return error;
    } else {
        return 'Unknown error occurred';
    }
}

export function isValidPohLangFile(filePath: string): boolean {
    return filePath.endsWith('.poh');
}

export function sanitizeOutput(output: string): string {
    // Remove ANSI escape codes and control characters
    return output.replace(/\x1b\[[0-9;]*m/g, '').replace(/\r\n/g, '\n');
}

export class PohLangError extends Error {
    constructor(
        message: string,
        public readonly line?: number,
        public readonly column?: number,
        public readonly severity: 'error' | 'warning' | 'info' = 'error'
    ) {
        super(message);
        this.name = 'PohLangError';
    }
}

export function parsePohLangError(errorOutput: string): PohLangError[] {
    const errors: PohLangError[] = [];
    const lines = errorOutput.split('\n');
    
    for (const line of lines) {
        // Parse different error formats
        // Format 1: "Line X: Error message"
        let match = line.match(/Line (\d+):\s*(.+)/);
        if (match) {
            const lineNumber = parseInt(match[1]);
            const message = match[2];
            errors.push(new PohLangError(message, lineNumber));
            continue;
        }
        
        // Format 2: "Error at line X, column Y: message"
        match = line.match(/Error at line (\d+), column (\d+):\s*(.+)/);
        if (match) {
            const lineNumber = parseInt(match[1]);
            const columnNumber = parseInt(match[2]);
            const message = match[3];
            errors.push(new PohLangError(message, lineNumber, columnNumber));
            continue;
        }
        
        // Format 3: "Warning: message"
        match = line.match(/Warning:\s*(.+)/);
        if (match) {
            const message = match[1];
            errors.push(new PohLangError(message, undefined, undefined, 'warning'));
            continue;
        }
        
        // Generic error if line contains "error" (case insensitive)
        if (line.toLowerCase().includes('error') && line.trim().length > 0) {
            errors.push(new PohLangError(line.trim()));
        }
    }
    
    return errors;
}