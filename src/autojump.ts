import * as fs from 'fs';
import * as vscode from 'vscode';
import { getUserHome } from './utils';
import QuickJumpCore, { DbCoreItem } from './QuickJumpCore';
interface DbItem extends DbCoreItem{
  weight: number
  path: string
}

class AutoJump extends QuickJumpCore<DbItem>{
  dbPath!: string;
  static pluginName = 'autojump';
  static getIsSupported() {
    const userHome = getUserHome();
    const possiblePaths = [
      `${userHome}/Library/autojump/autojump.txt`,
      `${userHome}/autojump/autojump.txt`,
      `${userHome}/Library/autojump/autojump.txt`
    ];
    return possiblePaths.find(item => fs.existsSync(item));
  }
  constructor(extensionConfig: vscode.WorkspaceConfiguration) {
    super(extensionConfig);
    const supported = AutoJump.getIsSupported();
    if (supported) {
      this.dbPath = supported;
    }
  }
  parseDb(): DbItem[] {
    const content = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
    if (!content) {return [];};
    return content.split(/\n/g).reduce((pre, cur) => {
      if (!cur) {return pre;};
      const [weight, itemPath] = cur.split(/\t/);
      const temp = {weight: parseFloat(weight),path: itemPath};
      pre.push(temp);
      return pre;
    }, [] as Array<DbItem>);
  }
  getFolderFromDb(folderAlias: string) {
    const dbItems = this.parseDb();
    const ignoreCase = this.config.get("ignoreCase");
    const aliasReg = new RegExp(folderAlias, ignoreCase ? "i" : "");
    return dbItems
      .filter((item) => aliasReg.test(item.path))
      .sort((a, b) => b.weight - a.weight);
  }
  writeDb(dbItems: DbItem[]) {
    const dbStr = dbItems.reduce((pre, cur) => {
      pre += `${cur.weight}\t${cur.path}\n`;
      return pre;
    }, '');
    fs.writeFileSync(this.dbPath, dbStr);
  }
  updateDb(folder: string, weight: number = 0) {
    const dbItems = this.parseDb();
    const itemIdx = dbItems.findIndex(item => item.path.includes(folder));
    if (itemIdx !== -1) {
      dbItems.splice(itemIdx, 1, {
        weight: this.calcWeight(weight),
        path: folder
      });
    } else {
      dbItems.push({
        weight: this.calcWeight(weight),
        path: folder
      });
    }
    this.writeDb(dbItems);
  }
  private calcWeight(weight = 0) {
    return Math.sqrt(weight ** 2 + 10 ** 2);
  }
}
export default AutoJump;