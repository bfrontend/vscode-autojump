import * as fs from 'fs';
import * as vscode from 'vscode';
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
export function getExtensionConfig(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration('autojump');
}
function getDbWithName(pluginMap: IPluginMap, name: IPluginTypes) {
  const pluginDb: string | Array<string> = pluginMap[name];
  const existPath = getExistPath(pluginDb);
  return existPath ? {
    type: name,
    dbpath: existPath
  } : undefined;
}
function getDbInMaps(pluginMap: IPluginMap) {
  let pluginName: IPluginTypes;
  for (pluginName in pluginMap) {
    return getDbWithName(pluginMap, pluginName);
  }
}
export function getSupported(type?: IPluginTypes) {
  const pluginMap = generateSupports();
  let result = null;
  if (type) {
    result = getDbWithName(pluginMap,type);
    !result && vscode.window.showErrorMessage(`名称为${type}的插件未找到,将使用默认数据管理工具`);
  } else {
    result = getDbInMaps(pluginMap);
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