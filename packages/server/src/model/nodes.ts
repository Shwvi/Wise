import { INode } from "@wise/common";
import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";
import { UsersModel } from "./users";
const baseConfig = {
  type: DataTypes.STRING,
  allowNull: false,
};
export const INodeModel = sequelize.define<Model<INode, INode>, any>(
  "wise_nodes",
  {
    nodeId: {
      ...baseConfig,
    },
    children: {
      ...baseConfig,
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    props: {
      ...baseConfig,
      type: DataTypes.JSON,
    },
    belong_to: {
      ...baseConfig,
    },
  },
  {
    freezeTableName: true,
  }
);

INodeModel.sync({})
  .then(() => {
    console.log("INode Model Sync Success!");
  })
  .catch((e) => {
    console.error(e);
  });
