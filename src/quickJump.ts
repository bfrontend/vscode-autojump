import { getSupported, getExtensionConfig } from "./utils";
import AutoJump from "./autojump";
import ZPlugin from "./z";
import Webxmsj from "./webxmsj";
export default class QucikJump {
  static getInstance() {
    const extensionConfig = getExtensionConfig();
    const smartPlugin = extensionConfig.smartPlugin;
    const dbInfo = smartPlugin ? getSupported(smartPlugin) : getSupported();
    if (dbInfo.type === 'autojump') {
      return new AutoJump(dbInfo, extensionConfig);
    } else if (dbInfo.type === 'z') {
      return new ZPlugin(dbInfo, extensionConfig);
    } else {
      return new Webxmsj(dbInfo, extensionConfig);
    }
  }
}