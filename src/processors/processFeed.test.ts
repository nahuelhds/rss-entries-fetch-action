import { setFailed } from "@actions/core";

import { FeedWithoutEntriesError } from "../extractors/errors";
import { extractFeed, FeedWithEntries } from "../extractors/extractFeed";
import { FeedEntry } from "../extractors/types/feed-extractor";
import logger from "../logger";
import { processEntry } from "./processEntry";
import { processFeed } from "./processFeed";

jest.mock("@actions/core");
jest.mock("../extractors/extractFeed");
jest.mock("../logger");
jest.mock("./processEntry");

describe("processFeed", () => {
  logger.warn = jest.fn();
  const setFailedMock = setFailed as jest.MockedFunction<typeof setFailed>;
  const extractFeedMock = extractFeed as jest.MockedFunction<
    typeof extractFeed
  >;
  const processEntryMock = processEntry as jest.MockedFunction<
    typeof processEntry
  >;

  it("returns error if something unexpected happens", async () => {
    const url = new URL("https://www.google.com");
    const expectedError = new Error("Unpredictable error");

    extractFeedMock.mockRejectedValue(expectedError);

    await expect(async () => await processFeed(url)).rejects.toThrow(
      expectedError,
    );

    expect(processEntryMock).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      "Unexpected error when processing feed",
      expectedError,
    );
  });

  it("warns the error if something happens", async () => {
    const url = new URL("https://www.google.com");
    const expectedError = new FeedWithoutEntriesError(url, {});
    extractFeedMock.mockRejectedValue(expectedError);

    await processFeed(url);

    expect(processEntryMock).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(expectedError.message);
    expect(setFailedMock).not.toHaveBeenCalled();
  });

  it("process the entries", async () => {
    const entry = { id: "test-entry" } as FeedEntry;
    const feedData = { entries: [entry] } as FeedWithEntries;
    extractFeedMock.mockResolvedValue(feedData);

    await processFeed(new URL("https://www.google.com"));

    expect(processEntryMock).toHaveBeenCalledWith(entry);
    expect(logger.warn).not.toHaveBeenCalledWith();
    expect(setFailedMock).not.toHaveBeenCalled();
  });
});
