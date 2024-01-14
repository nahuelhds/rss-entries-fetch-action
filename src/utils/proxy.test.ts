import { nextProxyAgent } from "./proxy";

jest.mock("./proxies", () => ({
  proxies: ["103.144.245.166:8081", "87.107.166.6:8090"],
}));

describe("nextProxyAgent", () => {
  it("returns a ProxyAgent", () => {
    expect(nextProxyAgent().proxy.host).toBe("103.144.245.166:8081");
  });

  it("returns the next ProxyAgent", () => {
    nextProxyAgent();
    // now returns the second
    expect(nextProxyAgent().proxy.host).toBe("87.107.166.6:8090");
  });

  it("resets the index when finishes the list", () => {
    nextProxyAgent();
    nextProxyAgent();
    // now resets to the first one
    expect(nextProxyAgent().proxy.host).toBe("103.144.245.166:8081");
  });
});
