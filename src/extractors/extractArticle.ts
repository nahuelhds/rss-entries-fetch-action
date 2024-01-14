import { FeedEntryWithLink } from "../processors/processEntry";
import { nextProxyAgent } from "../utils/proxy";
import { ArticleNotFoundError, ArticleWithoutUrlError } from "./errors";
import { articleExtractor } from "./helpers";
import { ArticleData } from "./types/article-extractor";

export type ArticleWithUrl = ArticleData & { url: string };

export async function extractArticle(feedEntry: FeedEntryWithLink) {
  const article = await fetchArticle(feedEntry);
  if (article === null) {
    throw new ArticleNotFoundError(feedEntry);
  }

  if (!article.url) {
    throw new ArticleWithoutUrlError(feedEntry, article);
  }

  return article as ArticleWithUrl;
}

async function fetchArticle(feedEntry: FeedEntryWithLink) {
  try {
    const extract = await articleExtractor();
    return await extract(
      feedEntry.link,
      {},
      {
        agent: nextProxyAgent(),
      },
    );
  } catch (err) {
    const error = err as Error;
    if (error.message === "Request failed with error code 404") {
      return null;
    }

    throw err;
  }
}
