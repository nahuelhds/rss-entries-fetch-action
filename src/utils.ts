import crypto from "crypto";

import { InvalidUrlError, ParseUrlsError } from "./errors";

export function getInputFeedUrls(): URL[] {
  return parseInputFeedUrls().map((url) => {
    try {
      return new URL(url); // This will throw an error if url is not a valid URL
    } catch (err) {
      throw new InvalidUrlError(url, err);
    }
  });
}

function parseInputFeedUrls(): string[] {
  const inputValue = process.env.INPUT_FEED_URL ?? "";
  try {
    // Try to parse the feed URL as JSON. This will work if it's an array or single URL
    const feeds = JSON.parse(inputValue);
    if (Array.isArray(feeds)) {
      return feeds;
    }

    return [feeds];
  } catch (err) {
    // If JSON.parse fails, assume feed is a regular string (single URL) and wrap it in an array
    if (inputValue !== "") {
      return [process.env.INPUT_FEED_URL ?? ""];
    }

    throw new ParseUrlsError(inputValue, err);
  }
}

export function getOutputDir() {
  return process.env.OUTPUT_FOLDER ?? "./";
}

export function buildFilename(url: string, outputLength = 40) {
  return crypto
    .createHash("shake256", { outputLength })
    .update(url)
    .digest("hex");
}
