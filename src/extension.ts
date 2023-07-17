import * as vscode from 'vscode';
import QuickJump from './quickJump';

export function activate(context: vscode.ExtensionContext) {
  const instance = QuickJump.getInstance();
  vscode.commands.registerCommand('autojump.openFolder', instance.openFolder.bind(instance));
}
