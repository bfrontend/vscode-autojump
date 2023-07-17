import * as fs from 'fs';
import QucikJumpCore, { DbCoreItem } from "./QucikJumpCore";
interface DbItem extends DbCoreItem{
  time: number
}
export default class ZPlugin extends QucikJumpCore<DbItem> {
  parseDb(): DbItem[] {
    const content = fs.readFileSync(this.db.dbpath, { encoding: 'utf-8' });
    if (!content) {return [];};
    return content.split(/\n/g).reduce((pre, cur) => {
      if (!cur) {return pre;};
      const [itemPath, weight, time] = cur.split('|');
      const temp = {weight: parseFloat(weight),path: itemPath,time:+time};
      pre.push(temp);
      return pre;
    }, [] as Array<DbItem>);
  }
  updateDb(folder: string, weight?: number): void {
    const itemIdx = this.dbItems.findIndex(item => item.path.includes(folder));
    if (itemIdx !== -1) {
      this.dbItems.splice(itemIdx, 1, {
        weight: this.dbItems[itemIdx].weight + 1,
        path: folder,
        time: Math.floor(Date.now() / 1000)
      });
    } else {
      this.dbItems.push({
        weight: 1,
        path: folder,
        time: Math.floor(Date.now() / 1000)
      });
    }
    this.writeDb(this.dbItems);
  }
  private writeDb(dbItems: DbItem[]) {
    const dbStr = dbItems.reduce((pre, cur) => {
      pre += `${cur.path}|${cur.weight}|${cur.time}\n`;
      return pre;
    }, '');
    fs.writeFileSync(this.db.dbpath, dbStr);
  }
}