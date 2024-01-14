import { nextProxyAgent } from "./proxy";

jest.mock("./proxies", () => ({
  proxies: ["103.144.245.166:8081", "87.107.166.6:8090"],
}));

describe("nextProxyAgent", () => {
  it("rotates a ProxyAgent", () => {
    expect(nextProxyAgent().proxy.host).toBe("103.144.245.166:8081");
    // now returns the second
    expect(nextProxyAgent().proxy.host).toBe("87.107.166.6:8090");
    // now resets to the first one
    expect(nextProxyAgent().proxy.host).toBe("103.144.245.166:8081");
  });
});
