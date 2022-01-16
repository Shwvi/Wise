import { EventEmitter } from "events";
import moment from "moment";
export const startEvent = "APP_START";
export class LifeCycler extends EventEmitter {
  startEvents: any[];
  constructor() {
    super();
    this.startEvents = [];
  }
  registerStart(event: any) {
    this.startEvents.push(event);
  }
  addDateTimer(date: Date, cb: () => void) {
    const eventName = "on" + date;
    this.addListener(eventName, cb);
  }
  removeDateTimer(date: Date, cb: () => void) {
    const eventName = "on" + date;
    this.removeListener(eventName, cb);
  }
  async start() {
    const res = await Promise.allSettled(
      this.startEvents.map((c) =>
        Promise.race([c(), timeout(__DEV__ ? 100 : 5000)])
      )
    );

    return res;
  }
}
export const lifeCycler = new LifeCycler();
export function timeout(limit: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("timeout");
    }, limit);
  });
}
// utils
export function getNowDayState() {
  const now = parseInt(moment().format("HH"), 10);
  if (now > 6 && now < 12) {
    return "morning";
  }
  if (now >= 12 && now < 18) {
    return "afternoon";
  }
  return "evening";
}
