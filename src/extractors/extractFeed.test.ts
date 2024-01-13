import { FeedData, FeedEntry } from "../types/feed-extractor";
import { FeedWithoutEntriesError } from "./errors";
import { extractFeed } from "./extractFeed";
import { feedExtractor } from "./helpers";

jest.mock("./helpers.ts", () => ({
  feedExtractor: jest.fn(),
}));

describe("extractFeed", () => {
  const feedExtractorMock = feedExtractor as jest.MockedFunction<
    typeof feedExtractor
  >;

  it.each([[[]], [undefined], [null]])(
    "throws FeedWithoutEntriesError if the feed has %s entries",
    async (entries) => {
      const testFeedData = { entries } as FeedData;
      const feedDataMock = jest.fn().mockResolvedValue(testFeedData);
      feedExtractorMock.mockResolvedValue(feedDataMock);
      await expect(
        async () => await extractFeed(new URL("https://www.google.com")),
      ).rejects.toThrow(FeedWithoutEntriesError);
    },
  );
  it("returns the feed data when contains entries", async () => {
    const expectedFeedData = {
      entries: [{ id: "some-link" } as FeedEntry],
    } as FeedData;
    const feedDataMock = jest.fn().mockResolvedValue(expectedFeedData);
    feedExtractorMock.mockResolvedValue(feedDataMock);
    expect(await extractFeed(new URL("https://www.google.com"))).toBe(
      expectedFeedData,
    );
  });
});
