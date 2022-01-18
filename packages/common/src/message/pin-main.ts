import { INode, User } from "..";

export type PinMessage = {
  type: "Pin";
  data: INode;
  extra: User;
};
export type PinRes = {
  type: "PinRes";
  data: boolean;
};
export type PinWinCreateMessage = {
  type: "PinCreate";
  data: User;
};
export type PinWinAlwaysTop = {
  type: "ARO-Change-Top";
  data: boolean;
};
