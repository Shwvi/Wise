import {
  INode,
  PinMessage,
  PinRes,
  PinWinCreateMessage,
  User,
} from "@wise/common";
import { sendMessageToMainProcess } from ".";

export function pinNewNode(node: INode) {
  return sendMessageToMainProcess<PinMessage, PinRes>({
    type: "Pin",
    data: node,
  });
}

export function createPinWindow(userInfo: User) {
  return sendMessageToMainProcess<PinWinCreateMessage, boolean>({
    type: "PinCreate",
    data: userInfo,
  });
}
