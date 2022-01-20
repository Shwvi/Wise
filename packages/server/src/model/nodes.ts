import { INode } from "@wise/common";
import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";

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
    // children is in prop
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

INodeModel.sync({ force: true })
  .then(() => {
    console.log("INode Model Sync Success!");
  })
  .catch((e) => {
    console.error(e);
  });
