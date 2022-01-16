import { User } from "@wise/common";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import { mountUserRouter } from "./service/mountUser";
import { nodeRouter } from "./service/node";
import { userRouter } from "./service/user";

const app = new Koa<
  Koa.DefaultState,
  Koa.DefaultContext & { body: any; wise_user?: User }
>();
const port = 8080;

app.use(
  cors({
    methods: "GET,POST,PATCH,OPTION,DELETE",
  })
);
app.use(bodyParser());
app.use(mountUserRouter);
app.use(userRouter.routes());
app.use(nodeRouter.routes());
app.listen(port, () => {
  console.log(`Server started at http://localhost:8080 🚀...`);
});
