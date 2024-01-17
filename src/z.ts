import * as fs from 'fs';
import * as vscode from 'vscode';
import QuickJumpCore, { DbCoreItem } from "./QuickJumpCore";
import { getUserHome } from './utils';
interface DbItem extends DbCoreItem{
  weight: number
  time: number
}
export default class ZPlugin extends QuickJumpCore<DbItem> {
  dbPath!: string;
  static pluginName = 'z';
  static getIsSupported() {
    const userHome = getUserHome();
    const dbPath = `${userHome}/.z`;
    const isExist = fs.existsSync(dbPath);
    return isExist ? dbPath : false;
  }
  constructor(extensionConfig: vscode.WorkspaceConfiguration) {
    super(extensionConfig);
    const supported = ZPlugin.getIsSupported();
    if (supported) {
      this.dbPath = supported;
    }
  }
  parseDb(): DbItem[] {
    const content = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
    if (!content) {return [];};
    return content.split(/\n/g).reduce((pre, cur) => {
      if (!cur) {return pre;};
      const [itemPath, weight, time] = cur.split('|');
      const temp = {weight: parseFloat(weight),path: itemPath,time:+time};
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
  updateDb(folder: string, weight?: number): void {
    const dbItems = this.parseDb();
    const itemIdx = dbItems.findIndex(item => item.path.includes(folder));
    if (itemIdx !== -1) {
      dbItems.splice(itemIdx, 1, {
        weight: dbItems[itemIdx].weight + 1,
        path: folder,
        time: Math.floor(Date.now() / 1000)
      });
    } else {
      dbItems.push({
        weight: 1,
        path: folder,
        time: Math.floor(Date.now() / 1000)
      });
    }
    this.writeDb(dbItems);
  }
  private writeDb(dbItems: DbItem[]) {
    const dbStr = dbItems.reduce((pre, cur) => {
      pre += `${cur.path}|${cur.weight}|${cur.time}\n`;
      return pre;
    }, '');
    fs.writeFileSync(this.dbPath, dbStr);
  }
}