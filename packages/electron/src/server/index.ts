import { User } from "@wise/common";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import multer from "koa-multer";
import statics from "koa-static";
import path from "path";
import { app as electronApp } from "electron";
import { mountUserRouter } from "./service/mountUser";
import { nodeRouter } from "./service/node";

import { userRouter } from "./service/user";

const useLocalDB = process.env.APPENV;
export function createServer() {
  return new Promise((resolve) => {
    const app = new Koa();
    const port = useLocalDB ? 8080 : 3030;
    app.use(
      cors({
        methods: "GET,POST,PATCH,OPTION,DELETE",
      })
    );
    // app.use(statics(path.join(electronApp.getPath("userData"), "./assets")));
    app.use(multer().any());
    app.use(bodyParser());
    app.use(mountUserRouter);
    app.use(userRouter.routes());
    app.use(nodeRouter.routes());

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port} 🚀...`);
      resolve("Server Started");
    });
  });
}
