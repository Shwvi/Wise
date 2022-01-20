import { getUserInfo, patchToken } from "@/api/request";
import { User } from "@wise/common";
import { atom, selector } from "recoil";
export const SetUserState = atom<User | null>({
  key: "SetUserState",
  default: null,
});
export const UserState = selector<User | null>({
  key: "UserState",
  get: async ({ get }) => {
    const setUser = get(SetUserState);
    if (setUser) {
      patchToken(setUser.token);
      return setUser;
    }
    const user = await getUserInfo();
    if (user) {
      patchToken(user.token);
    }
    return user;
  },
});
