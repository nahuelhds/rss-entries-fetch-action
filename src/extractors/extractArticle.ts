import {
  ArticleNotFoundError,
  ArticleWithoutUrlError,
  FeedEntryWithoutLinkError,
} from "./errors";
import { articleExtractor } from "./helpers";
import { ArticleData } from "./types/article-extractor";
import { FeedEntry } from "./types/feed-extractor";

export type ArticleWithUrl = ArticleData & { url: string };

async function fetchArticle(feedEntry: FeedEntry) {
  if (!feedEntry.link) {
    throw new FeedEntryWithoutLinkError(feedEntry);
  }

  try {
    const extract = await articleExtractor();
    return await extract(feedEntry.link);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Request failed with error code 404") {
      return null;
    }

    throw err;
  }
}

export async function extractArticle(feedEntry: FeedEntry) {
  const article = await fetchArticle(feedEntry);
  if (article === null) {
    throw new ArticleNotFoundError(feedEntry);
  }

  if (!article.url) {
    throw new ArticleWithoutUrlError(feedEntry, article);
  }

  return article as ArticleWithUrl;
}
