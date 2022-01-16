import axios from "axios";
import { getSnackbar } from "../ui/lib/globalMessage";
import { INode, INodeIdentifier, User } from "@wise/common";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { UserState, SetUserState } from "@/ui/state/core/user";

const WISETOKEN = "__WISETOKEN__";
const _saver: { wise_token: string | null } = {
  wise_token: localStorage.getItem(WISETOKEN) || null,
};
export const patchToken = (token: string) => {
  localStorage.setItem(WISETOKEN, token);
  _saver.wise_token = token;
};
export const getToken = () => _saver.wise_token;
export function useLoginOut() {
  const history = useHistory();
  const setUserState = useSetRecoilState(UserState);
  const setSetUserState = useSetRecoilState(SetUserState);
  return () => {
    localStorage.removeItem(WISETOKEN);
    _saver.wise_token = null;
    setUserState(null);
    setSetUserState(null);
    history.push("/");
  };
}
// when error return null
const request = axios.create({
  baseURL: "http://localhost:8080",
});

request.interceptors.response.use(
  (value) => {
    const { code } = value.data;
    if (code === 0) {
      return value.data?.data;
    } else {
      getSnackbar()?.(value.data.message, { variant: "error" });
      return null;
    }
  },
  (err) => {
    getSnackbar()?.(err.message || "Unknown request error", {
      variant: "error",
    });
    return null;
  }
);
request.interceptors.request.use((value) => {
  const wise_token = getToken();
  if (wise_token) {
    value.headers = {
      ...value.headers,
      wise_token,
    };
  }
  return value;
});
// node
export const findNode = (nodeId: string) =>
  request.get<{ nodeId: string }, INode | null>("/node", {
    params: {
      nodeId,
    },
  });

export const createNode = (node: INode) =>
  request.post<INode, boolean | null>("/node", node);
export const modifyNode = (node: INode) =>
  request.patch<INode, boolean | null>("/node", node);
export const deleteNode = (nodeId: INodeIdentifier) =>
  request.delete<{ nodeId: INodeIdentifier }, boolean | null>("/node", {
    params: { nodeId },
  });
// user
export const getUserInfo = () => request.get<never, User | null>("/user");
export const signUp = (username: string, password: string) =>
  request.post<Pick<User, "username" | "password">, User | null>("/user", {
    username,
    password,
  });
export const modifyUser = (newUser: Partial<User>) =>
  request.patch<Partial<User>, boolean | null>("/user", newUser);
export const deleteUser = () => request.delete<never, boolean | null>("/user");