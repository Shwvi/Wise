export type UserProps = {
  avatar: string;
};
export type User = {
  username: string;
  password: string;
  token: string;
  last_login: Date;
  query_num: number;
  user_type: "plain" | "super" | "admin";
  props: UserProps;
  is_deleted?: boolean;
};
export type INodeProps = {
  name: string;
  isCompleted?: boolean;
  content?: string;
  isDeleted?: boolean;
  children: INodeIdentifier[];
};
export type INodeIdentifier = string;
export type INode = {
  // 0 0_1 0_2_1
  nodeId: INodeIdentifier;
  props: INodeProps;
  // specify for database
  belong_to?: string;
};
