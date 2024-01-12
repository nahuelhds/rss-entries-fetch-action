import { setFailed } from "@actions/core";
import fs from "fs";

import { UnknownError } from "./errors";
import { logger } from "./logger";
import { ArticleExtractor } from "./types/article-extractor";
import { FeedData, FeedExtractor } from "./types/feed-extractor";
import { buildFilename, getInputFeedUrls, getOutputDir } from "./utils";

export async function run() {
  try {
    const articleExtractor = (await import(
      "@extractus/article-extractor"
    )) as unknown as ArticleExtractor;
    const feedExtractor = (await import(
      "@extractus/feed-extractor"
    )) as unknown as FeedExtractor;
    const outputDir = getOutputDir();
    const feedUrls = getInputFeedUrls();

    feedUrls.map(async (feedUrl: URL) => {
      const feedData: FeedData = await feedExtractor(feedUrl.toString());
      if (!feedData.entries || feedData.entries.length === 0) {
        logger.warn(
          `Feed ${feedUrl} does not contain any entry. Cannot continue.`,
        );
        return;
      }

      // Check if directory exists; if not, create it
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      void Promise.all(
        feedData.entries.map(async (feedEntry) => {
          if (!feedEntry.link) {
            logger.warn(
              `Entry ${feedEntry.id} does not contain a link. Cannot extract.`,
            );
            return null;
          }
          const article = await articleExtractor(feedEntry.link);
          if (article === null) {
            logger.warn(`Article ${feedEntry.link} responded nothing.`);
            return null;
          }

          if (!article.url) {
            logger.warn(
              `Article ${feedEntry.link} does not contain a defined url. Cannot store it.`,
            );
            return null;
          }

          const filename = buildFilename(article.url);
          const destinationFile = `${outputDir}/${filename}.json`;
          if (fs.existsSync(destinationFile)) {
            logger.debug(
              `Article ${article.url} already exists on path ${destinationFile}`,
            );
            return;
          }

          const fileContent = JSON.stringify(article, null, 2);
          fs.writeFileSync(destinationFile, fileContent, {
            encoding: "utf8",
          });
        }),
      );
    });
  } catch (error) {
    setFailed(new UnknownError(error).message);
  }
}
