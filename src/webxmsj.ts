import QucikJumpCore, { DbItem } from "./QucikJumpCore";

export default class Webxmsj extends QucikJumpCore {
  parseDb(): DbItem[] {
    throw new Error("Method not implemented.");
  }
  updateDb(path: string, weight?: number | undefined): void {
    throw new Error("Method not implemented.");
  }
}