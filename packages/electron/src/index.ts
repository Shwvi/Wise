// const { logger } = require("./log");

import { app, protocol } from "electron";
import path from "path";
import fs from "fs";
import { createMainWindow } from "./window/main";

const isDev = process.env.APPENV === "DEV";
const indexFile = "index.html";
const indexCss = "index.css";

app
  .whenReady()
  .then(() => {
    return new Promise((resolve) => {
      import("./server").then(({ createServer }) => {
        createServer().then(resolve);
      });
    });
  })
  .then(() => {
    protocol.interceptFileProtocol("file", (request, callback) => {
      const url = request.url.substr(7); // strip "file://" out of all urls
      if (url.startsWith("assets")) {
        const realPath = path.join(app.getPath("userData"), url);
        callback({ path: realPath });
        return;
      }
      if (request.url.endsWith(indexFile) || request.url.endsWith(indexCss)) {
        callback({ path: url });
      } else {
        const realPath = path.join(__dirname, "./app/dist", url);
        const realPinPath = path.join(__dirname, "./pin/dist", url);
        if (fs.existsSync(realPath)) {
          callback({ path: realPath });
        } else if (fs.existsSync(realPinPath)) {
          callback({ path: realPinPath });
        } else {
          callback({
            path: path.join(__dirname, "./app/dist", "index.html"),
          });
        }
      }
    });
  })
  .then(createMainWindow);

app.on("activate", () => {
  createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
  // app.quit();
});
