import * as vscode from 'vscode';

export interface DbConfig {
  type: string,
  dbpath: string
}
export interface DbItem {
  weight: number
  path: string
}
export default abstract class QucikJumpCore {
  db: DbConfig;
  config: vscode.WorkspaceConfiguration;
  dbItems: Array<DbItem>;
  constructor(dbInfo: DbConfig) {
    this.db = dbInfo;
    this.config = this.getConfig();
    this.dbItems = this.parseDb();
  }
  // 解析数据库
  abstract parseDb(): Array<DbItem>;
  // 更新文件别名在数据库中的权重
  abstract updateDb(path: string, weight?: number): void;

  getConfig() {
    return vscode.workspace.getConfiguration('quickjump');
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
  async openFolder(){
    const folderAlias = await this.getAliasFolder();
    if (!folderAlias) {return;};
    const items = this.dbItems.filter(item => item.path.includes(folderAlias)).sort((a,b)=>b.weight - a.weight);
    if (!items.length) {
      this.doNoMatch(folderAlias);
      return;
    };
    if (items.length === 1) {
      const item = items[0];
      this.updateDb(item.path, item.weight);
      this.changeFolder(item.path);
    } else {
      // TODO: 有多个潜在的匹配项 展示选择列表
    }
  }
}