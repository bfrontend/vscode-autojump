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
  constructor() {
    this.db = this.getDbPath();
    this.dbItems = this.readDb();
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
  async openFolder(){
    const folderAlias = await vscode.window.showInputBox({
      prompt: '请输入文件夹路径别名',
      placeHolder: ''
    });
    if (folderAlias) {
      const itemIdx = this.dbItems.sort((a, b) => b.weight - a.weight).findIndex(item => item.path.includes(folderAlias));
      if (itemIdx !== -1) {
        const item = this.dbItems[itemIdx];
        this.dbItems.splice(itemIdx, 1, {
          weight: this.calcWeight(item.weight),
          path: item.path
        });
        this.writeDb(this.dbItems);
        const uri = vscode.Uri.file(item.path);
        vscode.commands.executeCommand('vscode.openFolder', uri, false);
      } else {
        vscode.window.showWarningMessage(`未找到包含${folderAlias}的文件夹`);
      }
    }
  }
}
export default AutoJump;