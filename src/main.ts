import { setFailed } from "@actions/core";
import fs from "fs";
import { CustomError } from "ts-custom-error";

import { extractArticle } from "./extractors/extractArticle";
import { extractFeed } from "./extractors/extractFeed";
import { logger } from "./logger";
import { UnknownError } from "./utils/errors";
import { buildFilename, getInputFeedUrls, getOutputDir } from "./utils/utils";

export async function fetchEntries() {
  try {
    const outputDir = getOutputDir();
    const feedUrls = getInputFeedUrls();

    feedUrls.map(async (feedUrl: URL) => {
      try {
        const feedData = await extractFeed(feedUrl);
        if (!feedData) {
          logger.warn(
            `Feed %s does not contain any entry. Cannot continue.`,
            feedUrl,
          );
          return;
        }

        // Check if directory exists; if not, create it
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        void Promise.all(
          feedData.entries.map(async (feedEntry) => {
            try {
              const article = await extractArticle(feedEntry);

              if (!article) {
                logger.warn(
                  `Article "%s" is not valid or does not contain a defined url. Cannot store it.`,
                  feedEntry.link,
                );
                return;
              }

              const filename = buildFilename(article.url);
              const destinationFile = `${outputDir}/${filename}.json`;
              if (fs.existsSync(destinationFile)) {
                logger.debug(
                  `Article "%s" already exists on path "%s"`,
                  article.url,
                  destinationFile,
                );
                return;
              }

              const fileContent = JSON.stringify(article, null, 2);
              fs.writeFileSync(destinationFile, fileContent, {
                encoding: "utf8",
              });
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
          }),
        );
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
  }
}
