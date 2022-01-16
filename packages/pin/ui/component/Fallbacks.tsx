import { CircularProgress, LinearProgress } from "@mui/material";
import React from "react";
export type FacllBackProps = {
  size?: number;
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "inherit";
  coverclassname?: string;
};
export function FallBack({ size, color, coverclassname }: FacllBackProps) {
  return (
    <div
      className={`flex justify-center items-center ${
        coverclassname || "w-full h-full"
      }`}
    >
      <CircularProgress size={size} color={color} />
    </div>
  );
}
export function LineFallBack({ color }: Pick<FacllBackProps, "color">) {
  return (
    <div className="w-full flex justify-center items-center">
      <LinearProgress color={color} />
    </div>
  );
}
export function HomeFallBack() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <CircularProgress />
      <span className="mt-4">Enlight yourself with your splendid life!</span>
    </div>
  );
}
