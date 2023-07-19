import * as vscode from 'vscode';
export function getUserHome() {
  const os = process.platform as 'darwin' | 'win32' | 'linux';
  const homeMap = {
    darwin: process.env.HOME,
    win32: process.env.USERPROFILE,
    linux: process.env.HOME
  };
  return homeMap[os];
}
export function getExtensionConfig(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration('autojump');
}