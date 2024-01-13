import { FeedWithoutEntriesError } from "./errors";
import { feedExtractor } from "./helpers";
import { FeedData, FeedEntry } from "./types/feed-extractor";

type FeedWithEntries = FeedData & { entries: FeedEntry[] };

export async function extractFeed(feedUrl: URL) {
  const extract = await feedExtractor();
  const feedData = await extract(feedUrl.toString());

  if (!feedData.entries || feedData.entries.length === 0) {
    throw new FeedWithoutEntriesError(feedUrl, feedData);
  }

  return feedData as FeedWithEntries;
}
