import { CustomError } from "ts-custom-error";

import { extractArticle } from "../extractors/extractArticle";
import { FeedEntry } from "../extractors/types/feed-extractor";
import logger from "../logger";
import {
  FileExistsError,
  storeFile,
  validateAndGetDestinationPath,
} from "../utils/fs";

export type FeedEntryWithLink = FeedEntry & { link: string };

export async function processEntry(feedEntry: FeedEntry) {
  try {
    // Check destination path first because it throws if the file already exists
    // this way we avoid request what we don't actually need
    const destinationFile = validateAndGetDestinationPath(feedEntry);
    const feedEntryWithLink = feedEntry as FeedEntryWithLink;
    const article = await extractArticle(feedEntryWithLink);
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
