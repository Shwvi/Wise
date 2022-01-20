import { Sequelize } from "sequelize";
import { app } from "electron";
import path from "path";
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(app.getPath("userData"), "./wise.sqlite"),
  logging: process.env.APPENV === "DEV",
});
