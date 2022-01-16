import { generateSubScribe } from "../../hook";

const {
  useSubScribe: useSubScribeDark,
  dispatch,
  getCurValue: getCurDark,
} = generateSubScribe<"light" | "dark">("light");
function dispatchDark(value: "light" | "dark") {
  dispatch(value);
}
export { useSubScribeDark, getCurDark, dispatchDark };
