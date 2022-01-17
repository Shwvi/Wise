import { generateSubScribe } from "@/hook";
import { User } from "@wise/common";

export const {
  useSubScribe: useSubScribeUser,
  dispatch: dispatchUser,
  getCurValue: getUser,
} = generateSubScribe<User | null>(null);
