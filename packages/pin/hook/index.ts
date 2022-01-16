import { EventEmitter } from "events";
import { useEffect, useReducer } from "react";
export function generateSubScribe<T>(initValue: T): {
  useSubScribe: () => {
    value: T;
  };
  dispatch: (newValue: T | ((old: T) => T)) => void;
  initValue: T;
  getCurValue: () => T;
} {
  const emiter = new EventEmitter();
  let value = initValue;
  const dispatch = (newValue: ((old: T) => T) | T) => {
    typeof newValue === "function"
      ? (value = (newValue as (old: T) => T)(value))
      : (value = newValue);
    emiter.emit("sub");
  };
  const useSubScribe = () => {
    const [, forceUpdate] = useReducer((s) => s + 1, 0);
    useEffect(() => {
      emiter.addListener("sub", forceUpdate);
      return () => {
        emiter.removeListener("sub", forceUpdate);
      };
    }, []);
    return {
      value,
    };
  };
  const getCurValue = () => value;
  return {
    useSubScribe,
    dispatch,
    initValue,
    getCurValue,
  };
}
