import { Sequelize } from "sequelize";
import config from "../secret.json";
export const sequelize = new Sequelize(config.postgre, {
  logging: process.env.APPENV === "DEV",
});
