import { BrowserWindow, MessageChannelMain, screen } from "electron";
import path from "path";

const isDev = process.env.APPENV === "DEV";

export const createPinWindow = () => {
  const screens = screen.getAllDisplays();
  const win = new BrowserWindow({
    width: 400,
    height: screens[0].workArea.height,
    // closable: true,
    frame: false,
    // resizable: false,
    // titleBarStyle: "hidden",
    x: screens[0].workArea.width - 400,
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
    },
  });
  if (isDev) win.loadURL("http://localhost:3001/");
  else {
    const url = require("url").format({
      protocol: "file",
      slashes: true,
      pathname: require("path").join(__dirname, "../../../pin/dist/index.html"),
    });

    win.loadURL(url);
  }
  win.webContents.openDevTools();
  const { port1, port2 } = new MessageChannelMain();
  port2.postMessage("ARO_MAIN_CHANNEL");
  port2.on("message", (event) => {
    const { data } = event;
    const { key, message } = data;
    if (key && message) {
      if (message.type === "ARO-Change-Top") {
        win.setAlwaysOnTop(message.data);
        port2.postMessage({ key, message: message.data });
        return;
      }
      if (message.type === "window-close") {
        win.close();
        return;
      }
    }
  });
  port2.start();
  win.webContents.postMessage("main-world-port", null, [port1]);
};
