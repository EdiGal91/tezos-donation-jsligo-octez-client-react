import { Buffer } from "buffer";

(globalThis as any).Buffer = Buffer;
(globalThis as any).global = globalThis;

(globalThis as any).process = {
  env: {},
  nextTick: (fn: Function) => setTimeout(fn, 0),
  browser: true,
};

export { Buffer };
