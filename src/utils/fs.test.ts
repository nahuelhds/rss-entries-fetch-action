import fs from "fs";

import { FeedEntryWithoutLinkError } from "../extractors/errors";
import { FeedEntry } from "../extractors/types/feed-extractor";
import {
  FileExistsError,
  storeFile,
  validateAndGetDestinationPath,
} from "./fs";

jest.mock("fs");

describe("validateAndGetDestinationPath", () => {
  it("throws FeedEntryWithoutLinkError if the feed has no link", async () => {
    const feedEntry = {} as FeedEntry;
    expect(() => validateAndGetDestinationPath(feedEntry)).toThrow(
      FeedEntryWithoutLinkError,
    );
  });

  it("throws FileExistsError if file already exists", () => {
    fs.existsSync = jest.fn().mockReturnValue(true);
    const feedEntry = { link: "some-fake-link" } as FeedEntry;
    expect(() => validateAndGetDestinationPath(feedEntry)).toThrow(
      FileExistsError,
    );
  });
});

describe("storeFile", () => {
  it("creates the file", () => {
    const expectedPath = `dir/file.json`;
    const expectedContent = "fileContents";
    fs.existsSync = jest.fn();
    fs.mkdirSync = jest.fn();
    fs.writeFileSync = jest.fn();

    storeFile(expectedPath, expectedContent);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expectedPath,
      expectedContent,
      { encoding: "utf8" },
    );
  });

  it("creates the dir if it does not exists", () => {
    const expectedDir = "dir";
    const path = `${expectedDir}/file.json`;
    fs.existsSync = jest
      .fn()
      // File exists
      .mockReturnValueOnce(false)
      // Dir exists
      .mockReturnValueOnce(false);

    fs.mkdirSync = jest.fn();

    storeFile(path, "fileContents");
    expect(fs.mkdirSync).toHaveBeenCalledWith(expectedDir, {
      recursive: true,
    });
  });

  it("does not created the dir if it exists already", () => {
    const expectedDir = "dir";
    const path = `${expectedDir}/file.json`;
    fs.existsSync = jest
      .fn()
      // Dir exists
      .mockReturnValueOnce(true);

    fs.mkdirSync = jest.fn();

    storeFile(path, "fileContents");
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });
});
