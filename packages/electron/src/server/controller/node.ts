import { INode, INodeIdentifier, User } from "@wise/common";
import { INodeModel } from "../model/node";
const parseNodeId = (id: string) => {
  // 0_1_2
  return id.split("_");
};
export async function findAllNodes() {
  const nodes = await INodeModel.findAll();
  return nodes;
}
export async function findOneNodeById(user: User, nodeId: INodeIdentifier) {
  const resNode = await INodeModel.findOne({
    where: {
      nodeId: nodeId,
      belong_to: user.username,
    },
  });
  return resNode;
}
export async function createNode(user: User, node: INode) {
  const res = await INodeModel.create({
    ...node,
    belong_to: user.username,
  });
  const parsedNodeId = parseNodeId(node.nodeId);
  parsedNodeId.pop();
  const parentId = parsedNodeId.join("_");
  const parent = await INodeModel.findOne({
    where: {
      nodeId: parentId,
      belong_to: user.username,
    },
  });
  if (parent) {
    const parentProps = parent.getDataValue("props");
    parent.setDataValue("props", {
      ...parentProps,
      children: [...parentProps.children, res.getDataValue("nodeId")],
    });
    await parent.save();
  }
  return res;
}
export async function modifyNode(user: User, node: INode) {
  const res = await findOneNodeById(user, node.nodeId);
  if (res) {
    // node id should not be changed
    Object.keys(node).forEach((k) => {
      if ((node as any)[k] && k !== "nodeId")
        (res.setDataValue as any)(k, (node as any)[k]);
    });
    res.setDataValue("belong_to", user.username);
    await res.save();
    return true;
  }
  return false;
}
export async function deleteNodeById(user: User, nodeId: INodeIdentifier) {
  const res = await findOneNodeById(user, nodeId);
  if (res) {
    res.setDataValue("props", {
      ...res.getDataValue("props"),
      isDeleted: !res.getDataValue("props").isDeleted,
    });
    await res.save();
    return true;
  }
  return false;
}
export async function completeNodeById(user: User, nodeId: INodeIdentifier) {
  const res = await findOneNodeById(user, nodeId);
  if (res) {
    res.setDataValue("props", {
      ...res.getDataValue("props"),
      isCompleted: !res.getDataValue("props").isCompleted,
    });
    await res.save();
    return true;
  }
  return false;
}
