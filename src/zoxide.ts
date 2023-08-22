import { execSync } from 'child_process';
import QuickJumpCore from "./QuickJumpCore";
import * as which from 'which';

export default class ZPlugin extends QuickJumpCore {
  static pluginName = 'zoxide';
  static getIsSupported() {
    return which.sync('zoxide', { nothrow: true }) !== null;
  }
  getFolderFromDb(folderAlias: string) {
    const matchedPath = execSync(`zoxide query ${folderAlias} -l`, {encoding: 'utf-8'});
    return matchedPath.split('\n').filter(Boolean).map(k => ({
      path: k.replace(/[\r\n]/g, '')
    }));
  }
  updateDb(folder: string, weight?: number): void {
    execSync(`zoxide add ${folder}`, {encoding: 'utf-8'});
  }
}