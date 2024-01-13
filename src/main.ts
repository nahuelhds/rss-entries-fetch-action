import { setFailed } from "@actions/core";
import { CustomError } from "ts-custom-error";

import logger from "./logger";
import { processFeed } from "./processors/processFeed";
import { UnknownError } from "./utils/errors";
import { getInputFeedUrls } from "./utils/io";

export async function runAction() {
  try {
    const feedUrls = getInputFeedUrls();
    feedUrls.forEach((feedUrl) => processFeed(feedUrl));
  } catch (err) {
    // Even if it's a custom error, we want to return error for the process here
    if (err instanceof CustomError) {
      setFailed(err.message);
      return;
    }

    const unknownError = new UnknownError(err);
    logger.error(unknownError.message, unknownError);
    setFailed(unknownError.message);
    return;
  }
}
