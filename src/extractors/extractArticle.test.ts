import { FeedEntryWithLink } from "../processors/processEntry";
import { ArticleNotFoundError, ArticleWithoutUrlError } from "./errors";
import { extractArticle } from "./extractArticle";
import { articleExtractor } from "./helpers";
import { ArticleData } from "./types/article-extractor";

jest.mock("./helpers.ts", () => ({
  articleExtractor: jest.fn(),
}));

describe("extractArticle", () => {
  const articleExtractorMock = articleExtractor as jest.MockedFunction<
    typeof articleExtractor
  >;

  it("throws ArticleNotFoundError if the entry returns null", async () => {
    const articleDataMock = jest.fn().mockResolvedValue(null);
    articleExtractorMock.mockResolvedValue(articleDataMock);
    const feedEntry = { link: "some-fake-link" } as FeedEntryWithLink;
    await expect(async () => await extractArticle(feedEntry)).rejects.toThrow(
      ArticleNotFoundError,
    );
  });

  it("throws ArticleWithoutUrlError if the returned article has no url", async () => {
    const articleDataMock = jest
      .fn()
      .mockResolvedValue({ url: undefined } as ArticleData);
    articleExtractorMock.mockResolvedValue(articleDataMock);
    const feedEntry = { link: "some-fake-link" } as FeedEntryWithLink;
    await expect(async () => await extractArticle(feedEntry)).rejects.toThrow(
      ArticleWithoutUrlError,
    );
  });

  it("returns the article when it has url", async () => {
    const expectedArticleData = { url: "some-other-fake-link" } as ArticleData;
    const articleDataMock = jest.fn().mockResolvedValue(expectedArticleData);
    articleExtractorMock.mockResolvedValue(articleDataMock);

    const feedEntry = { link: "some-fake-link" } as FeedEntryWithLink;
    expect(await extractArticle(feedEntry)).toBe(expectedArticleData);
  });
});
