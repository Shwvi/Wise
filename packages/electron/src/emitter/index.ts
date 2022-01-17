import { EventEmitter } from "events";

class WindowMessageEmitter extends EventEmitter {
  registerMain(cb: (message: any) => void) {
    this.addListener("MainWin", cb);
  }
  emitMain<T>(message: T) {
    this.emit("MainWin", message);
  }
  registerPin(cb: (message: any) => void) {
    this.addListener("MainWin", cb);
  }
  emitPin<T>(message: T) {
    this.emit("MainWin", message);
  }
}

export const winMessageEmitter = new WindowMessageEmitter();
