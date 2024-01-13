import { CustomError } from "ts-custom-error";

import { ArticleData } from "./types/article-extractor";
import { FeedData, FeedEntry } from "./types/feed-extractor";

export class FeedWithoutEntriesError extends CustomError {
  public constructor(
    public feedUrl: URL,
    public feedData: FeedData,
  ) {
    super(
      `Entry "${feedUrl.toString()}" does not contain entries. Cannot continue.`,
    );
    this.feedUrl = feedUrl;
    this.feedData = feedData;
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "FeedWithoutEntriesError" });
  }
}

export class FeedEntryWithoutLinkError extends CustomError {
  public constructor(public feedEntry: FeedEntry) {
    super(`Entry "${feedEntry.id}" does not contain a link. Cannot extract.`);
    this.feedEntry = feedEntry;
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "FeedEntryWithoutLinkError" });
  }
}

export class ArticleNotFoundError extends CustomError {
  public constructor(public feedEntry: FeedEntry) {
    super(`Entry "${feedEntry.id}" returned nothings. Cannot proceed.`);
    this.feedEntry = feedEntry;
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "FeedNotFoundError" });
  }
}

export class ArticleWithoutUrlError extends CustomError {
  public constructor(
    public feedEntry: FeedEntry,
    public article: ArticleData,
  ) {
    super(
      `Entry "${feedEntry.id}" returned an article without URL. Cannot proceed.`,
    );
    this.feedEntry = feedEntry;
    this.article = article;
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "ArticleWithoutUrlError" });
  }
}
