import { InvalidUrlError, NoUrlsGivenError, ParseUrlsError } from "./errors";
import { buildFilename, getDestinationFolder, getInputFeedUrls } from "./io";

const originalEnv = process.env;

describe("io", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  describe("getInputFeedUrls", () => {
    it("throws NoUrlsGivenError if FEED_URLS is an empty string", () => {
      process.env.FEED_URLS = "";
      expect(() => getInputFeedUrls()).toThrow(NoUrlsGivenError);
    });

    it("throws InvalidUrlError if FEED_URLS is not an URL", () => {
      process.env.FEED_URLS = "not-a-val;;;id-url";
      expect(() => getInputFeedUrls()).toThrow(InvalidUrlError);
    });

    it("throws InvalidUrlError if FEED_URLS contains a not an URL", () => {
      process.env.FEED_URLS =
        '["https://www.google.com", "not-a-val;;;id-url"]';
      expect(() => getInputFeedUrls()).toThrow(InvalidUrlError);
    });

    it("throws ParseUrlsError if FEED_URLS is not an array or string", () => {
      process.env.FEED_URLS =
        '{ "https://www.google.com": "not-a-val;;;id-url" }';
      expect(() => getInputFeedUrls()).toThrow(ParseUrlsError);
    });

    it("returns URL per every url string given", () => {
      const urls = ["https://www.google.com", "https://www.facebook.com"];
      process.env.FEED_URLS = JSON.stringify(urls);
      expect(getInputFeedUrls()).toStrictEqual(urls.map((url) => new URL(url)));
    });

    it("returns an URL array when a common string is given", () => {
      const url = "https://www.google.com";
      process.env.FEED_URLS = JSON.stringify(url);
      expect(getInputFeedUrls()).toStrictEqual([new URL(url)]);
    });
  });

  describe("getOutputDir", () => {
    it.each([[undefined], [""]])(
      "returns ./ if DESTINATION_FOLDER is %s",
      (falsyValue) => {
        process.env.DESTINATION_FOLDER = falsyValue;
        expect(getDestinationFolder()).toBe("./");
      },
    );

    it("returns DESTINATION_FOLDER if it is set", () => {
      process.env.DESTINATION_FOLDER = "./public";
      expect(getDestinationFolder()).toBe("./public");
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
