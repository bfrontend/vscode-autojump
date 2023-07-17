import * as fs from 'fs';
type IPluginTypes = 'autojump' | 'z' | 'webxmsj';
type IPluginMap = {
  [key in IPluginTypes]: string | Array<string>
};
function generateSupports(): IPluginMap {
  const os = process.platform as 'darwin' | 'win32' | 'linux';
  const homeMap = {
    darwin: process.env.HOME,
    win32: process.env.USERPROFILE,
    linux: process.env.HOME
  };
  const userHome = homeMap[os];
  return {
    autojump: [
      `${userHome}/Library/autojump/autojump.txt`,
      `${userHome}/autojump/autojump.txt`,
      `${userHome}/Library/autojump/autojump.txt`
    ],
    z: `${userHome}/.z`,
    webxmsj: `${userHome}/.webxmsj`
  };
}
function getExistPath(pluginDb: string | Array<string>): string | undefined {
  if (Array.isArray(pluginDb)) {
    return pluginDb.find(dbpath => fs.existsSync(dbpath));
  } else {
    const isExist = fs.existsSync(pluginDb);
    return isExist ? pluginDb : '';
  }
}
export function getSupported() {
  const pluginMap = generateSupports();
  let pluginName: IPluginTypes;
  let result = null;
  for (pluginName in pluginMap) {
    const pluginDb: string | Array<string> = pluginMap[pluginName];
    const existPath = getExistPath(pluginDb);
    if (existPath) {
      result = {
        type: pluginName,
        dbpath: existPath
      };
      break;
    }
  }
  if (!result) {
    fs.writeFileSync(pluginMap.webxmsj as string, '');
    result = {
      type: 'webxmsj',
      dbpath: pluginMap.webxmsj as string
    };
  }
  return result;
}