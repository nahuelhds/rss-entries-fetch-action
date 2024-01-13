import { InvalidUrlError, NoUrlsGivenError, ParseUrlsError } from "./errors";
import { buildFilename, getInputFeedUrls, getOutputDir } from "./utils";

const originalEnv = process.env;

describe("utils", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });
  afterEach(() => {
    jest.resetModules();
  });
  describe("getInputFeedUrls", () => {
    it("throws NoUrlsGivenError if INPUT_FEED_URL is an empty string", () => {
      process.env.INPUT_FEED_URL = "";
      expect(() => getInputFeedUrls()).toThrow(NoUrlsGivenError);
    });

    it("throws InvalidUrlError if INPUT_FEED_URL is not an URL", () => {
      process.env.INPUT_FEED_URL = "not-a-val;;;id-url";
      expect(() => getInputFeedUrls()).toThrow(InvalidUrlError);
    });

    it("throws InvalidUrlError if INPUT_FEED_URL contains a not an URL", () => {
      process.env.INPUT_FEED_URL =
        '["https://www.google.com", "not-a-val;;;id-url"]';
      expect(() => getInputFeedUrls()).toThrow(InvalidUrlError);
    });

    it("throws ParseUrlsError if INPUT_FEED_URL is not an array or string", () => {
      process.env.INPUT_FEED_URL =
        '{ "https://www.google.com": "not-a-val;;;id-url" }';
      expect(() => getInputFeedUrls()).toThrow(ParseUrlsError);
    });

    it("returns URL per every url string given", () => {
      const urls = ["https://www.google.com", "https://www.facebook.com"];
      process.env.INPUT_FEED_URL = JSON.stringify(urls);
      expect(getInputFeedUrls()).toStrictEqual(urls.map((url) => new URL(url)));
    });

    it("returns an URL array when a common string is given", () => {
      const url = "https://www.google.com";
      process.env.INPUT_FEED_URL = JSON.stringify(url);
      expect(getInputFeedUrls()).toStrictEqual([new URL(url)]);
    });
  });

  describe("getOutputDir", () => {
    it.each([[undefined], [""]])(
      "returns ./ if OUTPUT_FOLDER is %s",
      (falsyValue) => {
        process.env.OUTPUT_FOLDER = falsyValue;
        expect(getOutputDir()).toBe("./");
      },
    );

    it("returns OUTPUT_FOLDER if it is set", () => {
      process.env.OUTPUT_FOLDER = "./public";
      expect(getOutputDir()).toBe("./public");
    });
  });

  describe("buildFilename", () => {
    it('hashes with "shake256" algorithm and "base64url" digest', () => {
      expect(buildFilename("https://www.google.com")).toBe(
        "Bt0Lyb9EIA2yt8uFZWTd0saWhOXHx9illE_1E8hcfxh9h5qvVbd0Yg",
      );
    });
    it("cuts the hash in the defined longitude", () => {
      expect(buildFilename("https://www.google.com", 10)).toBe(
        "Bt0Lyb9EIA2ytw",
      );
    });
  });
});
