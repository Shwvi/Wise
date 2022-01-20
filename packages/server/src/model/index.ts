import { Sequelize } from "sequelize";
import config from "../secret.json";
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./wise.sqlite",
  logging: process.env.APPENV === "DEV",
});
