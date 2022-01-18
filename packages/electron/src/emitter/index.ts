import { EventEmitter } from "events";

class WindowMessageEmitter extends EventEmitter {
  registerMain(cb: (message: any) => void) {
    this.removeAllListeners("MainWin");
    this.addListener("MainWin", cb);
  }
  emitMain<T>(message: T) {
    this.emit("MainWin", message);
  }
  registerPin(cb: (message: any) => void) {
    this.removeAllListeners("MainPin");
    this.addListener("MainPin", cb);
  }
  emitPin<T>(message: T) {
    this.emit("MainPin", message);
  }
}

export const winMessageEmitter = new WindowMessageEmitter();
