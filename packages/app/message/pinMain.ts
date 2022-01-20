import { INode, PinMessage, PinRes, User } from "@wise/common";
import { sendMessageToMainProcess } from ".";

export function pinNewNode(node: INode, userInfo: User, weak?: boolean) {
  return sendMessageToMainProcess<PinMessage, PinRes>({
    type: "Pin",
    data: node,
    extra: userInfo,
    weak,
  });
}
