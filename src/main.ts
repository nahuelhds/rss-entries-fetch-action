import { setFailed } from "@actions/core";
import { CustomError } from "ts-custom-error";

import { extractArticle } from "./extractors/extractArticle";
import { extractFeed } from "./extractors/extractFeed";
import { FeedEntry } from "./extractors/types/feed-extractor";
import { logger } from "./logger";
import { UnknownError } from "./utils/errors";
import { storeFile } from "./utils/fs";
import { buildFilename, getInputFeedUrls, getOutputDir } from "./utils/io";

export async function fetchEntries() {
  try {
    const feedUrls = getInputFeedUrls();

    feedUrls.map(async (feedUrl: URL) => {
      try {
        const feedData = await extractFeed(feedUrl);
        void Promise.all(feedData.entries.map(processEntry));
      } catch (err) {
        if (err instanceof CustomError) {
          logger.warn(err.message);
          return;
        }

        setFailed(new UnknownError(err).message);
        return;
      }
    });
  } catch (error) {
    setFailed(new UnknownError(error).message);
    return;
  }
}

async function processEntry(feedEntry: FeedEntry) {
  const outputDir = getOutputDir();
  try {
    const article = await extractArticle(feedEntry);
    const filename = buildFilename(article.url);
    const destinationFile = `${outputDir}/${filename}.json`;
    const fileContents = JSON.stringify(article, null, 2);
    storeFile(destinationFile, fileContents);
    logger.info(
      `New article stored: "%s". Path: "%s"`,
      article.url,
      destinationFile,
    );
  } catch (err) {
    if (err instanceof CustomError) {
      logger.warn(err.message);
      return;
    }

    setFailed(new UnknownError(err).message);
    return;
  }
}
