/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import { fetchEntries } from "./main";
import requireActual = jest.requireActual;

jest.mock("@extractus/feed-extractor", () => jest.fn());

jest.mock("./utils/utils", () => ({
  ...requireActual("./utils"),
  getInputFeedUrls: jest.fn(() => ["https://www.google.com"]),
}));

describe("fetchEntries", () => {
  it("calls run when imported", async () => {
    await fetchEntries();
  });
});
