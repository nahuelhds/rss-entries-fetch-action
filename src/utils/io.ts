import crypto from "crypto";

import { InvalidUrlError, NoUrlsGivenError, ParseUrlsError } from "./errors";

export function getInputFeedUrls(): URL[] {
  return parseInputFeedUrls().map((url) => {
    try {
      return new URL(url); // This will throw an error if url is not a valid URL
    } catch (err) {
      throw new InvalidUrlError(url, err);
    }
  });
}

function jsonParseOrFallback(inputValue: string) {
  try {
    // Try to parse the feed URL as JSON. This will work if it's an array or single URL
    return JSON.parse(inputValue);
  } catch (err) {
    // If JSON.parse fails, assume feed is a regular string (single URL) and wrap it in an array
    if (inputValue !== "") {
      return [inputValue];
    }

    throw new NoUrlsGivenError(err);
  }
}

function parseInputFeedUrls(): string[] {
  const inputValue = process.env.INPUT_FEED_URL ?? "";
  const feeds: unknown = jsonParseOrFallback(inputValue);

  if (Array.isArray(feeds)) {
    return feeds;
  }

  if (typeof feeds === "string") {
    return [feeds];
  }

  throw new ParseUrlsError(feeds);
}

export function getDestinationFolder() {
  return process.env.DESTINATION_FOLDER || "./";
}

export function buildFilename(url: string, outputLength = 40) {
  return crypto
    .createHash("shake256", { outputLength })
    .update(url)
    .digest("base64url");
}
