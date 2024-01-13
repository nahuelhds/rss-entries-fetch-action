import { setFailed } from "@actions/core";

import { FeedEntryWithoutLinkError } from "../extractors/errors";
import { ArticleWithUrl, extractArticle } from "../extractors/extractArticle";
import { FeedEntry } from "../extractors/types/feed-extractor";
import logger from "../logger";
import { UnknownError } from "../utils/errors";
import { storeFile } from "../utils/fs";
import { buildFilename, getOutputDir } from "../utils/io";
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
    const thrownError = new Error("Unpredictable error");
    const expectedError = new UnknownError(thrownError);
    extractArticleMock.mockRejectedValue(thrownError);

    await processEntry({ id: "test-id" });

    expect(storeFileMock).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
    expect(setFailedMock).toHaveBeenCalledWith(expectedError.message);
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
    const destinationFile = `${getOutputDir()}/${filename}.json`;
    const fileContents = JSON.stringify(article, null, 2);
    extractArticleMock.mockResolvedValue(article);

    await processEntry(feedEntry);

    expect(storeFileMock).toHaveBeenCalledWith(destinationFile, fileContents);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(setFailedMock).not.toHaveBeenCalled();
  });
});
