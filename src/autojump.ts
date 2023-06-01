import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface DbConfig {
  dataPath: string,
  backupPath: string
}
interface DbItem {
  weight: number
  path: string
}


class AutoJump {
  db: DbConfig;
  dbItems: DbItem[] = [];
  config: vscode.WorkspaceConfiguration;
  constructor() {
    this.db = this.getDbPath();
    this.dbItems = this.readDb();
    this.config = this.getConfig();
  }
  getConfig() {
    return vscode.workspace.getConfiguration('autojump');
  }
  readDb(): DbItem[] {
    try {
      const content = fs.readFileSync(this.db.dataPath, { encoding: 'utf-8' });
      const defaultDb: DbItem[] = [];
      if (!content) {return [];};
      return content.split(/\n/g).reduce((pre, cur) => {
        if (!cur) {return pre;};
        const [weight, itemPath] = cur.split(/\t/);
        const temp = {weight: parseFloat(weight),path: itemPath};
        pre.push(temp);
        return pre;
      }, defaultDb);
    } catch (error) {
      fs.mkdirSync(path.dirname(this.db.dataPath), { recursive: true });
      fs.writeFileSync(this.db.dataPath, '');
      return [];
    }
  }
  writeDb(dbItems: DbItem[]) {
    const dbStr = dbItems.reduce((pre, cur) => {
      pre += `${cur.weight}\t${cur.path}\n`;
      return pre;
    }, '');
    fs.writeFileSync(this.db.dataPath, dbStr);
  }
  updateDb(folder: string, weight: number = 0) {
    const itemIdx = this.dbItems.findIndex(item => item.path.includes(folder));
    if (itemIdx !== -1) {
      this.dbItems.splice(itemIdx, 1, {
        weight: this.calcWeight(weight),
        path: folder
      });
    } else {
      this.dbItems.push({
        weight: this.calcWeight(weight),
        path: folder
      });
    }
    this.writeDb(this.dbItems);
  }
  calcWeight(weight = 0) {
    return Math.sqrt(weight ** 2 + 10 ** 2);
  }
  getDbPath(): DbConfig {
    const pathMap = {
      darwin: `${process.env.HOME}/Library/autojump`,
      win32: `${process.env.USERPROFILE}/autojump`,
      linux: `${process.env.HOME}/Library/autojump`
    };
    const os = process.platform as 'darwin' | 'win32' | 'linux';
    const dbPath = ['darwin', 'win32', 'linux'].includes(os) ? pathMap[os] : pathMap.darwin;
    return {
      dataPath: `${dbPath}/autojump.txt`,
      backupPath: `${dbPath}/autojump.txt.bak`
    };
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
  showWarnModal(folderAlias: string) {
    return vscode.window.showWarningMessage(`未找到包含${folderAlias}的文件夹, 是否打开文件夹选择器`, { modal: true }, '否', '是').then(val => {
      if (val === '是') {
        return this.showChoseFolder();
      }
      return Promise.reject('cancel chose');
    });
  }
  async openFolder(){
    const folderAlias = await vscode.window.showInputBox({
      prompt: '请输入文件夹路径别名',
      placeHolder: ''
    });
    if (folderAlias) {
      const items = this.dbItems.filter(item => item.path.includes(folderAlias)).sort((a,b)=>b.weight - a.weight);
      if (items.length) {
        const item = items[0];
        this.updateDb(item.path, item.weight);
        this.changeFolder(item.path);
      } else {
        const isSkipWarnModal= this.config.get('isSkipWarnModal');
        const continueThenable = isSkipWarnModal
          ? this.showChoseFolder()
            : this.showWarnModal(folderAlias);
        continueThenable.then(folderUri => {
          this.updateDb(folderUri.path);
          this.changeFolder(folderUri);
        });
      }
    }
  }
  changeFolder(folder: string | vscode.Uri) {
    let uri = folder;
    if (typeof folder === 'string') {
      uri = vscode.Uri.file(folder);
    }
    vscode.commands.executeCommand('vscode.openFolder', uri, false);
  }
}
export default AutoJump;