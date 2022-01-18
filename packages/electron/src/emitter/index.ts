import { BrowserWindow } from "electron";
import { EventEmitter } from "events";

class WindowMessageEmitter extends EventEmitter {
  pinWin?: BrowserWindow;
  mainWin?: BrowserWindow;
  registerMain(cb: (message: any) => void, mainWin: BrowserWindow) {
    this.removeAllListeners("MainWin");
    this.mainWin = mainWin;
    this.addListener("MainWin", cb);
  }
  emitMain<T>(message: T) {
    this.emit("MainWin", message);
  }
  registerPin(cb: (message: any) => void, pinWin: BrowserWindow) {
    this.removeAllListeners("MainPin");
    this.pinWin = pinWin;
    this.addListener("MainPin", cb);
  }
  emitPin<T>(message: T) {
    this.emit("MainPin", message);
  }
}

export const winMessageEmitter = new WindowMessageEmitter();
