import { ArticleExtractor } from "./types/article-extractor";
import { FeedExtractor } from "./types/feed-extractor";

export async function feedExtractor() {
  const feedExtractor = (await import(
    "@extractus/feed-extractor"
  )) as unknown as { extract: FeedExtractor };
  return feedExtractor.extract;
}

export async function articleExtractor() {
  const articleExtractor = (await import(
    "@extractus/article-extractor"
  )) as unknown as { extract: ArticleExtractor };
  return articleExtractor.extract;
}
