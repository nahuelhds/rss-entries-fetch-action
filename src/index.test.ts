/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import * as main from "./main";

jest.spyOn(main, "runAction");

describe("index", () => {
  it("calls run when imported", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("./index");

    expect(main.runAction).toHaveBeenCalled();
  });
});
