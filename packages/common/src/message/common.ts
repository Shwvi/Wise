export type RefreshWindowMessage = {
  type: "refreshWIndow";
};
export type IBSMessage = {
  key: string;
  type: "IBSMessage";
  message: any;
};
export type IBSResponse = {
  key: string;
  type: "IBSResponse";
  data?: any;
  message?: any;
};
