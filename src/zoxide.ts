import { execSync } from 'child_process';
import QucikJumpCore from "./QucikJumpCore";
import * as which from 'which';

export default class ZPlugin extends QucikJumpCore {
  static pluginName = 'zoxide';
  static getIsSupported() {
    return which.sync('zoxide', { nothrow: true }) !== null;
  }
  getFolderFromDb(folderAlias: string) {
    const matchedPath = execSync(`zoxide query ${folderAlias} -l`, {encoding: 'utf-8'});
    return [{
      path: matchedPath.replace(/[\r\n]/g, '')
    }];
  }
  updateDb(folder: string, weight?: number): void {
    execSync(`zoxide add ${folder}`, {encoding: 'utf-8'});
  }
}