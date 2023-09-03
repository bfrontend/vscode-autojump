import * as vscode from 'vscode';
import QuickJump from './quickJump';

export function activate(context: vscode.ExtensionContext) {
  let commands = getCommands();
  context.subscriptions.push(...commands);
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("autojump")) {
      commands.forEach((k) => k.dispose());
      commands = getCommands();
      context.subscriptions.push(...commands);
    }
  });
}

function getCommands() {
  const instance = QuickJump.getInstance();
  const openFolderCommand = vscode.commands.registerCommand(
    "autojump.openFolder",
    instance.openFolder.bind(instance)
  );
  const revealFolderCommand = vscode.commands.registerCommand(
    "autojump.revealFolder",
    instance.revealFolder.bind(instance)
  );
  return [openFolderCommand, revealFolderCommand];
}