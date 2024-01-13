import { setFailed } from "@actions/core";

import { FeedEntryWithoutLinkError } from "../extractors/errors";
import { ArticleWithUrl, extractArticle } from "../extractors/extractArticle";
import { FeedEntry } from "../extractors/types/feed-extractor";
import logger from "../logger";
import { storeFile } from "../utils/fs";
import { buildFilename, getDestinationFolder } from "../utils/io";
import { processEntry } from "./processEntry";

jest.mock("@actions/core");
jest.mock("../extractors/extractArticle");
jest.mock("../logger");
jest.mock("../utils/fs");

describe("processEntry", () => {
  logger.warn = jest.fn();
  const setFailedMock = setFailed as jest.MockedFunction<typeof setFailed>;
  const extractArticleMock = extractArticle as jest.MockedFunction<
    typeof extractArticle
  >;
  const storeFileMock = storeFile as jest.MockedFunction<typeof storeFile>;

  it("returns error if something unexpected happens", async () => {
    const expectedError = new Error("Unpredictable error");
    extractArticleMock.mockRejectedValue(expectedError);

    await expect(
      async () => await processEntry({ id: "test-id" }),
    ).rejects.toThrow(expectedError);

    expect(storeFileMock).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      "Unexpected error when processing entry",
      expectedError,
    );
  });

  it("warns the error if something happens", async () => {
    const feedEntry = { id: "test-id" };
    const expectedError = new FeedEntryWithoutLinkError(feedEntry);
    extractArticleMock.mockRejectedValue(expectedError);

    await processEntry(feedEntry);

    expect(storeFileMock).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(expectedError.message);
    expect(setFailedMock).not.toHaveBeenCalled();
  });

  it("process the entry if everything is okay", async () => {
    const feedEntry = { id: "test-id" } as FeedEntry;
    const article = { url: "https://www.google.com" } as ArticleWithUrl;

    const filename = buildFilename(article.url);
    const destinationFile = `${getDestinationFolder()}/${filename}.json`;
    const fileContents = JSON.stringify(article, null, 2);
    extractArticleMock.mockResolvedValue(article);

    await processEntry(feedEntry);

    expect(storeFileMock).toHaveBeenCalledWith(destinationFile, fileContents);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(setFailedMock).not.toHaveBeenCalled();
  });
});
