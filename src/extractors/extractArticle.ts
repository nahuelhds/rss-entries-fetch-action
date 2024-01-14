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

const useProxy = false;

async function fetchArticle(feedEntry: FeedEntryWithLink) {
  try {
    const extract = await articleExtractor();
    // TODO: see fetch-retry for exponential backoff
    //  should change to use extractHtml so we can use the fetch directly
    return await extract(
      feedEntry.link,
      {},
      {
        agent: useProxy ? nextProxyAgent() : undefined,
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
