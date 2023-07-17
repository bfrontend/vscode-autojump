import * as fs from 'fs';
import QucikJumpCore, { DbCoreItem } from './QucikJumpCore';
interface DbItem extends DbCoreItem{
  weight: number
  path: string
}
class AutoJump extends QucikJumpCore<DbItem>{
  parseDb(): DbItem[] {
    const content = fs.readFileSync(this.db.dbpath, { encoding: 'utf-8' });
    if (!content) {return [];};
    return content.split(/\n/g).reduce((pre, cur) => {
      if (!cur) {return pre;};
      const [weight, itemPath] = cur.split(/\t/);
      const temp = {weight: parseFloat(weight),path: itemPath};
      pre.push(temp);
      return pre;
    }, [] as Array<DbItem>);
  }
  writeDb(dbItems: DbItem[]) {
    const dbStr = dbItems.reduce((pre, cur) => {
      pre += `${cur.weight}\t${cur.path}\n`;
      return pre;
    }, '');
    fs.writeFileSync(this.db.dbpath, dbStr);
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
  private calcWeight(weight = 0) {
    return Math.sqrt(weight ** 2 + 10 ** 2);
  }
}
export default AutoJump;