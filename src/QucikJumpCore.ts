import * as vscode from 'vscode';

export interface DbCoreItem {
  path: string
  weight?: number
}
export default abstract class QucikJumpCore<T extends DbCoreItem = DbCoreItem> {
  config: vscode.WorkspaceConfiguration;
  constructor(extensionConfig: vscode.WorkspaceConfiguration) {
    this.config = extensionConfig;
  }
  // 更新文件别名在数据库中的权重
  abstract updateDb(path: string, weight?: number): void;
  abstract getFolderFromDb(query?: string): Array<T>;

  getConfig() {
    return vscode.workspace.getConfiguration('autojump');
  }
  async getAliasFolder() {
    return vscode.window.showInputBox({
      prompt: '请输入文件夹路径别名',
      placeHolder: ''
    });
  }
  // 更改工作空间的文件夹
  changeFolder(folder: string | vscode.Uri) {
    let uri = folder;
    if (typeof folder === 'string') {
      uri = vscode.Uri.file(folder);
    }
    vscode.commands.executeCommand('vscode.openFolder', uri, false);
  }
  showWarnModal(folderAlias: string) {
    return vscode.window.showWarningMessage(`未找到包含${folderAlias}的文件夹, 是否打开文件夹选择器`, { modal: true }, '否', '是').then(val => {
      if (val === '是') {
        return this.showChoseFolder();
      }
      return Promise.reject('cancel chose');
    });
  }
  showChoseFolder(): Thenable<vscode.Uri> {
    return vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false
    }).then(folders => {
      if (folders) {
        const [folder] = folders;
        return folder;
      }
      return Promise.reject('no Folder');
    });
  }
  doNoMatch(folderAlias: string) {
    const isSkipWarnModal= this.config.get('isSkipWarnModal');
    const continueThenable = isSkipWarnModal
      ? this.showChoseFolder()
        : this.showWarnModal(folderAlias);
    continueThenable.then(folderUri => {
      this.updateDb(folderUri.path);
      this.changeFolder(folderUri);
    });
  }
  showQuickPick(folderAlias: string, items: Array<T>) {
    const pickItems = items.map(k => k.path);
    return vscode.window.showQuickPick(pickItems).then(folder => {
      const chosedItem = items.find(m => m.path === folder);
      return {
        alias: folderAlias,
        item: chosedItem
      };
    });
  }
  private async getFolderFromAlias() {
    const folderAlias = await this.getAliasFolder();
    if (!folderAlias) {return;};
    const items = this.getFolderFromDb(folderAlias);
    if (items.length <= 1) {
      return {
        alias: folderAlias,
        item: !items.length ? null : items[0]
      };
    } else {
      return this.showQuickPick(folderAlias, items);
    }
  }
  private getProjectPath() {
    let currentUri: vscode.Uri | undefined;
    if (Array.isArray(vscode.workspace.workspaceFolders)) {
      if (vscode.workspace.workspaceFolders.length === 1) {
        currentUri = vscode.workspace.workspaceFolders[0].uri;
      }
      else if (vscode.workspace.workspaceFolders.length > 1) {
        const activeTextEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        if (activeTextEditor) {
          const workspaceFolder = vscode.workspace.workspaceFolders.find((folder: any) =>
            activeTextEditor.document.uri.path.startsWith(folder.uri.path),
          );
          if (workspaceFolder)
            {currentUri = workspaceFolder.uri;};
        }
      }
      return currentUri;
    }
  }
  async revealFolder() {
    const result = await this.getFolderFromAlias();
    if (!result) {return;};
    if (!result.item) {
      const projectPath = this.getProjectPath();
      if (this.config.isRevealCurrent) {
        if (projectPath) {
          vscode.commands.executeCommand('revealFileInOS', projectPath);
        }
      } else {
        vscode.window.showInformationMessage(`未找到包含${result.alias}的文件夹`);
      }
    } else {
      // ? 是否需要更新数据
      // this.updateDb(result.item.path, result.item.weight);
      vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(result.item.path));
    }
  }
  async openFolder(){
    const result = await this.getFolderFromAlias();
    if (!result) {return;};
    if (!result.item) {
      this.doNoMatch(result.alias);
    } else {
      this.updateDb(result.item.path, result.item.weight);
      this.changeFolder(result.item.path);
    }
  }
}