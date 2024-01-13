import { CustomError } from "ts-custom-error";

import { extractArticle } from "../extractors/extractArticle";
import { FeedEntry } from "../extractors/types/feed-extractor";
import logger from "../logger";
import { FileExistsError, storeFile } from "../utils/fs";
import { buildFilename, getDestinationFolder } from "../utils/io";

export async function processEntry(feedEntry: FeedEntry) {
  const outputDir = getDestinationFolder();
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
    if (err instanceof FileExistsError) {
      logger.debug(err.message);
      return;
    }

    if (err instanceof CustomError) {
      logger.warn(err.message);
      return;
    }

    logger.error("Unexpected error when processing entry", err);
    throw err;
  }
}
