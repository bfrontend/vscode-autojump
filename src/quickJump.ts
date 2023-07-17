import { getSupported } from "./utils";
import AutoJump from "./autojump";
import ZPlugin from "./z";
import Webxmsj from "./webxmsj";
export default class QucikJump {
  static getInstance() {
    const dbInfo = getSupported();
    if (dbInfo.type === 'autojump') {
      return new AutoJump(dbInfo);
    } else if (dbInfo.type === 'z') {
      return new ZPlugin(dbInfo);
    } else {
      return new Webxmsj(dbInfo);
    }
  }
}