import * as fs from 'fs';
import * as path from 'path';
import QucikJumpCore, { DbItem } from './QucikJumpCore';

class AutoJump extends QucikJumpCore{
  parseDb(): DbItem[] {
    try {
      const content = fs.readFileSync(this.db.dbpath, { encoding: 'utf-8' });
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
      fs.mkdirSync(path.dirname(this.db.dbpath), { recursive: true });
      fs.writeFileSync(this.db.dbpath, '');
      return [];
    }
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
  calcWeight(weight = 0) {
    return Math.sqrt(weight ** 2 + 10 ** 2);
  }
}
export default AutoJump;