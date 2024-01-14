import fs from "fs";
import path from "path";
import { CustomError } from "ts-custom-error";

import { FeedEntryWithoutLinkError } from "../extractors/errors";
import { FeedEntry } from "../extractors/types/feed-extractor";
import { buildFilename, getDestinationFolder } from "./io";

export function validateAndGetDestinationPath(feedEntry: FeedEntry) {
  if (!feedEntry.link) {
    throw new FeedEntryWithoutLinkError(feedEntry);
  }
  const filename = buildFilename(feedEntry.link);
  const outputDir = getDestinationFolder();
  const destinationFile = `${outputDir}/${filename}.json`;
  if (fs.existsSync(destinationFile)) {
    throw new FileExistsError(destinationFile);
  }
  return destinationFile;
}

export function storeFile(destinationPath: string, fileContents: string) {
  const dir = path.dirname(destinationPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(destinationPath, fileContents, {
    encoding: "utf8",
  });
}

export class FileExistsError extends CustomError {
  public constructor(path: string) {
    super(`The file "${path}" already exists`);
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "FileExistsError" });
  }
}
