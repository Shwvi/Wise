import { generateSubScribe } from "../../hook";

export const {
  useSubScribe: useSubScribeSpeaking,
  dispatch: dispatchSpeaking,
} = generateSubScribe<boolean | null>(null);
