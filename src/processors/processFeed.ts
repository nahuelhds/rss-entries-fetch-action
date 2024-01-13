import { CustomError } from "ts-custom-error";

import { extractFeed } from "../extractors/extractFeed";
import logger from "../logger";
import { processEntry } from "./processEntry";

export async function processFeed(feedUrl: URL) {
  try {
    const feedData = await extractFeed(feedUrl);
    void Promise.all(feedData.entries.map((entry) => processEntry(entry)));
  } catch (err) {
    if (err instanceof CustomError) {
      logger.warn(err.message);
      return;
    }

    logger.error("Unexpected error when processing feed", err);
    throw err;
  }
}
