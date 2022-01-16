import { atom } from "recoil";

export const MenuModelOpenState = atom<boolean>({
  key: "MenuModalOpenState",
  default: false,
});
