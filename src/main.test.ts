import { setFailed } from "@actions/core";

import { runAction } from "./main";
import { processFeed } from "./processors/processFeed";
import { InvalidUrlError, UnknownError } from "./utils/errors";
import { getInputFeedUrls } from "./utils/io";

jest.mock("@actions/core");
jest.mock("./processors/processFeed");
jest.mock("./utils/io");
jest.mock("./logger");

describe("runAction", () => {
  const setFailedMock = setFailed as jest.MockedFunction<typeof setFailed>;
  const getInputFeedUrlsMock = getInputFeedUrls as jest.MockedFunction<
    typeof getInputFeedUrls
  >;
  const processFeedMock = processFeed as jest.MockedFunction<
    typeof processFeed
  >;

  it("returns error if something unexpected happens", async () => {
    const thrownError = new Error();
    const expectedError = new UnknownError(thrownError);
    getInputFeedUrlsMock.mockImplementation(() => {
      throw thrownError;
    });

    await runAction();

    expect(setFailedMock).toHaveBeenCalledWith(expectedError.message);
  });

  it("returns error if the feed urls throw", async () => {
    const expectedError = new InvalidUrlError("asd", new Error());
    getInputFeedUrlsMock.mockImplementation(() => {
      throw expectedError;
    });

    await runAction();

    expect(setFailedMock).toHaveBeenCalledWith(expectedError.message);
  });

  it("starts processing the feed if everything is ok", async () => {
    const expectedUrl = new URL("https://www.google.com");
    const expectedUrl2 = new URL("https://www.google.com.uy");
    getInputFeedUrlsMock.mockReturnValue([expectedUrl, expectedUrl2]);

    await runAction();

    expect(processFeedMock).toHaveBeenCalledWith(expectedUrl);
    expect(processFeedMock).toHaveBeenCalledWith(expectedUrl2);
  });
});
