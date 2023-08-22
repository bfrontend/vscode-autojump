import * as fs from 'fs';
import * as vscode from 'vscode';
import QuickJumpCore, { DbCoreItem } from "./QuickJumpCore";
import { getUserHome } from './utils';
interface DbItem extends DbCoreItem {
  weight: number
  path: string
}
export default class Webxmsj extends QuickJumpCore<DbItem> {
  dbPath!: string;
  static pluginName = 'webxmsj';
  static getIsSupported() {
    const userHome = getUserHome();
    const dbPath = `${userHome}/.webxmsj`;
    const isExists = fs.existsSync(dbPath);
    if (!isExists) {
      fs.writeFileSync(dbPath, '');
    }
    return dbPath;
  }
  constructor(extensionConfig: vscode.WorkspaceConfiguration) {
    super(extensionConfig);
    const supported = Webxmsj.getIsSupported();
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
    return dbItems.filter(item => item.path.includes(folderAlias)).sort((a,b)=>b.weight - a.weight);
  }
  updateDb(folder: string, weight?: number): void {
    const dbItems = this.parseDb();
    const itemIdx = dbItems.findIndex(item => item.path.includes(folder));
    if (itemIdx !== -1) {
      dbItems.splice(itemIdx, 1, {
        weight: dbItems[itemIdx].weight + 1,
        path: folder
      });
    } else {
      dbItems.push({
        weight: 1,
        path: folder
      });
    }
    this.writeDb(dbItems);
  }
  private writeDb(dbItems: DbItem[]) {
    const dbStr = dbItems.reduce((pre, cur) => {
      pre += `${cur.path}|${cur.weight}\n`;
      return pre;
    }, '');
    fs.writeFileSync(this.dbPath, dbStr);
  }
}