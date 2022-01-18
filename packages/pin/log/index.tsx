import chalk from "chalk";

const mapModeToColor: {
  error: "red";
  info: "blue";
  success: "green";
  warn: "yellow";
} = {
  error: "red",
  info: "blue",
  success: "green",
  warn: "yellow",
};
export function log(
  message: string,
  header?: string,
  mode: "error" | "info" | "success" | "warn" = "info"
) {
  if (__DEV__) {
    console.log(
      chalk[mapModeToColor[mode]](`${header || "Logger"}:${message}`)
    );
  }
}
