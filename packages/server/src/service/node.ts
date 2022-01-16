import Router from "koa-router";
import {
  completeNodeById,
  createNode,
  deleteNodeById,
  findAllNodes,
  findOneNodeById,
  modifyNode,
} from "../controller/node";
import { INode } from "@wise/common";

export const nodeRouter = new Router({ prefix: "/node" });
nodeRouter
  .get("/all", async (ctx) => {
    const nodes = await findAllNodes();
    ctx.body = {
      data: nodes,
      code: 0,
    };
  })
  .post("/", async (ctx) => {
    const node: INode = ctx.request.body;
    const user = (ctx as any).wise_user;
    if (node && user) {
      const res = await createNode(user, node);
      if (res) {
        ctx.body = {
          data: true,
          code: 0,
        };
      }
      return;
    }
    ctx.body = {
      code: -1,
      message: `Oops, failed to create the node.`,
    };
  })
  .get("/", async (ctx) => {
    const { nodeId } = ctx.query;
    const user = (ctx as any).wise_user;
    if (nodeId && user) {
      const node = await findOneNodeById(user, nodeId as string);
      if (node) {
        ctx.body = {
          code: 0,
          data: node,
        };
        return;
      }
    }
    ctx.body = {
      code: -1,
      message: `Oops, failed to get node with id ${nodeId}`,
    };
  })
  .patch("/", async (ctx) => {
    const node = ctx.request.body as INode;
    const user = (ctx as any).wise_user;
    if (node && user) {
      const res = await modifyNode(user, node);
      ctx.body = {
        code: 0,
        data: res,
      };
      return;
    }
    ctx.body = {
      code: -1,
      message: `Oops, failed to modify node with id ${node.nodeId}`,
    };
  })
  .delete("/", async (ctx) => {
    const { nodeId } = ctx.query;
    const user = (ctx as any).wise_user;
    if (nodeId && user) {
      const res = await deleteNodeById(user, nodeId as string);
      ctx.body = {
        code: 0,
        data: res,
      };
      return;
    }
    ctx.body = {
      code: -1,
      message: `Oops, failed to delete node with id ${nodeId}`,
    };
  })
  .get("/complete", async (ctx) => {
    const { nodeId } = ctx.query;
    const user = (ctx as any).wise_user;
    if (nodeId && user) {
      const res = await completeNodeById(user, nodeId as string);
      ctx.body = {
        code: 0,
        data: res,
      };
      return;
    }
    ctx.body = {
      code: -1,
      message: `Oops, failed to complete node with id ${nodeId}`,
    };
  });
