import * as vscode from 'vscode';
import AutoJump from './autojump';

export function activate(context: vscode.ExtensionContext) {
  const autoJump = new AutoJump();
  vscode.commands.registerCommand('autojump.openFolder', autoJump.openFolder.bind(autoJump));
}

export function deactivate() {}
