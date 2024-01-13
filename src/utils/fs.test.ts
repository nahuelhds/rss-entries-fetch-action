import fs from "fs";

import { FileExistsError, storeFile } from "./fs";

jest.mock("fs");

describe("storeFile", () => {
  it("throws FileExistsError if file already exists", () => {
    fs.existsSync = jest.fn().mockReturnValue(true);
    expect(() => storeFile("some-file.json", "fileContents")).toThrow(
      FileExistsError,
    );
  });

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
      // File exists
      .mockReturnValueOnce(false)
      // Dir exists
      .mockReturnValueOnce(true);

    fs.mkdirSync = jest.fn();

    storeFile(path, "fileContents");
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });
});
