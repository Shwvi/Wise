import { User } from "@wise/common";
import Router from "koa-router";
import { Model } from "sequelize/dist";
import fs from "fs";
import path from "path";
import {
  createUser,
  deleteUser,
  modifyUser,
  test,
  tryLogin,
} from "../controller/user";
import { app } from "electron";
const test_username = (username: string) =>
  /^\w+[\w\s]{3,23}\w$/.test(username);
export const userRouter = new Router({ prefix: "/user" });
const prefix = path.join(app.getPath("userData"), "./assets");

userRouter
  .get("/test", async (ctx) => {
    await test();
  })
  .get("/", async (ctx) => {
    const user = (ctx as any).wise_user;
    if (user) {
      ctx.body = {
        code: 0,
        data: user,
      };
      return;
    }
    ctx.body = {
      code: 0,
      data: null,
    };
  })
  .post("/", async (ctx) => {
    const { username, password } = ctx.request.body;
    if (!test_username(username)) {
      ctx.body = {
        code: -1,
        message: `Unvalid username. Please use with letter or whitespace only. (Be sure to start and end with letter)`,
      };
      return;
    }
    if (password.length < 6) {
      ctx.body = {
        code: -1,
        message: `Unvalid password. It should be more than six characters.`,
      };
      return;
    }
    const loginUser = await tryLogin(username, password);
    if (loginUser) {
      ctx.body = {
        code: 0,
        data: loginUser,
      };
      return;
    }
    const user = await createUser({ username, password });
    if (user) {
      const rawUser = user.get();
      ctx.body = {
        code: 0,
        // !danger we pass all the user back
        data: rawUser,
      };
    } else {
      ctx.body = {
        code: -1,
        message: `User name ${username} has already been used.`,
      };
    }
  })
  .patch("/", async (ctx) => {
    const newUser: User = ctx.request.body;
    if (newUser) {
      const res = await modifyUser(newUser);
      if (res) {
        ctx.body = {
          code: 0,
          data: true,
        };
        return;
      }
    }
    ctx.body = {
      code: -1,
      message: `Oops, failed to modify user ${newUser.username}`,
    };
  })
  .delete("/", async (ctx) => {
    const user: Model<User, User> | null = (ctx as any).wise_user;
    if (user) {
      const res = await deleteUser(user.getDataValue("token"));
      if (res) {
        ctx.body = {
          code: 0,
          data: true,
        };
        return;
      }
    }
    ctx.body = {
      code: -1,
      message: `Oops, failed to delete user ${user}`,
    };
  })
  .post("/uploadimg", async (ctx) => {
    const file = (ctx.req as any).files[0];
    const user: Model<User, User> | null = (ctx as any).wise_user;

    if (file && user) {
      const { originalname, buffer } = file;

      try {
        if (!fs.existsSync(prefix)) {
          fs.mkdirSync(prefix);
        }
        fs.writeFileSync(path.join(prefix, `./${originalname}`), buffer);
        user.setDataValue("props", {
          ...user.getDataValue("props"),
          avatar: originalname,
        });
        await user.save();
        ctx.body = {
          code: 0,
          data: originalname,
        };
        return;
      } catch (e: any) {
        ctx.body = {
          code: -1,
          message: e.message || `Ooops, failed to write file.`,
        };
        return;
      }
    }
    ctx.body = {
      code: -1,
      message: `No file or user found`,
    };
  });
