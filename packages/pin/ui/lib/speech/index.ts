import { dispatchSpeaking } from "../../state/speak";

export function setSpeech() {
  return new Promise(function (resolve, reject) {
    const synth = window.speechSynthesis;
    let id: NodeJS.Timer;

    // eslint-disable-next-line prefer-const
    id = setInterval(() => {
      if (synth.getVoices().length !== 0) {
        resolve(synth.getVoices());
        clearInterval(id);
      }
    }, 10);
  });
}
// 6 17 26 28 31 33 40
export const voiceConfig = {
  voiceIndex: 33,
};
export type SpeakText = {
  text: string;
  afterWait?: number;
};
export class Speak {
  msgs: { speech: SpeechSynthesisUtterance; afterWait?: number }[];
  constructor(texts: SpeakText[]) {
    this.msgs = texts.map(({ text, afterWait }) => {
      const msg = new SpeechSynthesisUtterance();
      const voices = speechSynthesis.getVoices();
      msg.voice = voices[voiceConfig.voiceIndex];
      msg.text = text;
      msg.lang = "zh-CN";
      return {
        speech: msg,
        afterWait,
      };
    });
  }
  async play() {
    const { msgs } = this;
    for (let i = 0; i < msgs.length; i++) {
      await playVoice(msgs[i].speech);
      if (msgs[i].afterWait) await sleep(msgs[i].afterWait!);
    }
  }
}
function playVoice(voice: SpeechSynthesisUtterance) {
  return new Promise<void>((resolve) => {
    voice.addEventListener("end", () => {
      dispatchSpeaking(false);
      resolve();
    });
    dispatchSpeaking(true);
    speechSynthesis.speak(voice);
  });
}
export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
