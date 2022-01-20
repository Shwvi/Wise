import { UsersModel } from "../model/users";
import { v4 as uuid } from "uuid";
import { User } from "@wise/common";
import { createNode } from "./node";

export async function test() {
  const user = await UsersModel.create({
    username: "wsh",
    password: "123456",
    token: uuid(),
    last_login: new Date(),
    query_num: 0,
    user_type: "admin",
    props: {
      avatar: "default url",
    },
  });
  return user;
}

export async function findUserByToken(token: string) {
  const user = await UsersModel.findOne({
    where: {
      token,
    },
  });
  return user;
}
export async function createUser(user: Pick<User, "username" | "password">) {
  const { username, password } = user;
  const newUser: User = {
    username,
    password,
    token: uuid(),
    last_login: new Date(),
    query_num: 0,
    user_type: "plain",
    props: {
      avatar: "default url",
    },
  };
  try {
    const createdUser = await UsersModel.create(newUser);
    await createNode(newUser, {
      nodeId: "0",
      props: {
        name: "/",
        children: [],
      },
      belong_to: newUser.username,
    });
    return createdUser;
  } catch {
    return null;
  }
}
export async function modifyUser(newUser: User) {
  const originalUser = await findUserByToken(newUser.token);
  if (originalUser) {
    const [_, res] = await UsersModel.update(
      { ...originalUser, ...newUser },
      {
        where: { token: newUser.token },
      }
    );
    if (res.length > 0) {
      return true;
    }
  }
  return false;
}
export async function deleteUser(token: string) {
  const currentUser = await findUserByToken(token);
  if (currentUser) {
    currentUser.setDataValue("is_deleted", true);
    await currentUser.save();
    return true;
  }
  return false;
}
export async function tryLogin(username: string, password: string) {
  const user = await UsersModel.findOne({
    where: {
      username,
      password,
    },
  });
  if (user) {
    user.setDataValue("token", uuid());
    await user.save();
  }
  return user;
}
export async function findUserByName(username: string) {
  const user = await UsersModel.findOne({ where: { username } });
  return user;
}
