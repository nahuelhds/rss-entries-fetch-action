import { HttpsProxyAgent } from "https-proxy-agent";

import { proxies } from "./proxies";

let index = -1;

export function nextProxyAgent() {
  // If the next proxy index if out of bounds, reset it to 0
  if (index === proxies.length) {
    index = -1;
  }
  return new HttpsProxyAgent(`http://${proxies[++index]}`);
}
