import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import { User } from "@wise/common";
const baseConfig = {
  allowNull: false,
  type: DataTypes.TEXT,
};

export const UsersModel = sequelize.define<Model<User, User>, any>(
  // <
  //   Model<any, any>,
  //   {
  //     id: string;
  //     uid: string;
  //     username: string;
  //     password: string;
  //     token: string;
  //     last_login: Date;
  //     query_num: number;
  //     user_type: "plain" | "super" | "admin";
  //     is_deleted: boolean
  //   }
  // >
  "wise_users",
  {
    uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    username: {
      ...baseConfig,
      unique: true,
    },
    password: {
      ...baseConfig,
    },
    token: {
      ...baseConfig,
      type: DataTypes.UUID,
      unique: true,
    },
    last_login: {
      ...baseConfig,
      type: DataTypes.DATE,
    },
    query_num: {
      ...baseConfig,
      type: DataTypes.INTEGER,
    },
    user_type: {
      ...baseConfig,
      type: DataTypes.ENUM("plain", "super", "admin"),
    },
    props: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);
UsersModel.sync({})
  .then(() => {
    console.log("User Model Sync Success!");
  })
  .catch((e) => {
    console.error(e);
  });
