import { User } from "@wise/common";
import { Model } from "sequelize";
import { findUserByToken } from "../controller/user";

export const mountUserRouter = async (
  ctx: { headers: { [x: string]: any } },
  next: () => any
) => {
  const wise_token = ctx.headers["wise_token"];
  if (wise_token && !Array.isArray(wise_token)) {
    const user = await findUserByToken(wise_token);
    // it's really annoying that the koa-router
    // can't share the type of ctx with the Koa
    (ctx as typeof ctx & { wise_user: Model<User, User> | null }).wise_user =
      user;
  }
  await next();
};
