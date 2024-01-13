import {
  ArticleNotFoundError,
  ArticleWithoutUrlError,
  FeedEntryWithoutLinkError,
} from "./errors";
import { articleExtractor } from "./helpers";
import { ArticleData } from "./types/article-extractor";
import { FeedEntry } from "./types/feed-extractor";

type ArticleWithUrl = ArticleData & { url: string };

export async function extractArticle(feedEntry: FeedEntry) {
  if (!feedEntry.link) {
    throw new FeedEntryWithoutLinkError(feedEntry);
  }

  const extract = await articleExtractor();
  const article = await extract(feedEntry.link);
  if (article === null) {
    throw new ArticleNotFoundError(feedEntry);
  }

  if (!article.url) {
    throw new ArticleWithoutUrlError(feedEntry, article);
  }

  return article as ArticleWithUrl;
}
