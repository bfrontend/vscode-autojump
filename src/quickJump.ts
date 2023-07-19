import * as vscode from 'vscode';
import { getExtensionConfig } from "./utils";
import AutoJump from "./autojump";
import ZPlugin from "./z";
import Zoxide from './zoxide';
import Webxmsj from "./webxmsj";
type SmartPluginType = 'autojump' | 'z' | 'zoxide' | 'webxmsj';
export default class QucikJump {
  static getInstance() {
    const extensionConfig = getExtensionConfig();
    const smartPlugin: SmartPluginType = extensionConfig.smartPlugin;
    return QucikJump.autoFindInstance(extensionConfig, smartPlugin);
  }
  static autoFindInstance(extensionConfig: vscode.WorkspaceConfiguration, name?: SmartPluginType) {
    const possibleFactory = [AutoJump, ZPlugin, Zoxide].filter(item => name ? item.pluginName === name : true);
    const smartClass = possibleFactory.find(cls => cls.getIsSupported());
    if (smartClass) {
      return new smartClass(extensionConfig);
    }
    if (name) {
      vscode.window.showErrorMessage(`名称为${name}的插件未找到,将使用默认数据管理工具`);
    }
    return new Webxmsj(extensionConfig);
  }
}