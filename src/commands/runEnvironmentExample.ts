import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import { ensureSDKsUpToDate } from '../utils/fetchLatestSDKs';

export async function runEnvironmentExample(): Promise<void> {
  const output = vscode.window.createOutputChannel('PohLang Example');
  output.show(true);
  try {
    const ext = vscode.extensions.getExtension('pohlang.pohlang-hub');
    const context: vscode.ExtensionContext | undefined = (ext as any)?.exports?.context;
    if (!context) throw new Error('Extension context not available');

    await ensureSDKsUpToDate(context);

    const binDir = path.join(context.extensionPath, 'bin');
    const pohlangBin = path.join(binDir, process.platform === 'win32' ? 'pohlang.exe' : 'pohlang');

    // Create a sample script under the workspace or bin
    const workspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    const scriptPath = path.join(workspace ?? binDir, 'example.poh');
    const content = Buffer.from('print "PohLang Environment OK"\n', 'utf8');
    await vscode.workspace.fs.writeFile(vscode.Uri.file(scriptPath), content);

    const proc = cp.spawn(pohlangBin, [scriptPath], { shell: process.platform === 'win32' });
    proc.stdout.on('data', d => output.append(d.toString()));
    proc.stderr.on('data', d => output.append(d.toString()));
    proc.on('close', code => {
      output.appendLine(`\nProcess exited with code ${code}`);
      if (code === 0) {
        vscode.window.showInformationMessage('Environment example ran successfully.');
      } else {
        vscode.window.showErrorMessage('Environment example failed. Check output for details.');
      }
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`Failed to run example: ${msg}`);
    output.appendLine(`Failed to run example: ${msg}`);
  }
}
