import { CustomError } from "ts-custom-error";

export class InvalidUrlError extends CustomError {
  public constructor(
    public invalidUrl: string,
    cause: unknown,
  ) {
    super(`Invalid URL given: ${invalidUrl}`, { cause });
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "InvalidUrlError" });
  }
}

export class ParseUrlsError extends CustomError {
  public constructor(
    public wrongUrlString: string,
    cause: unknown,
  ) {
    super(`Failed to parse the given URL strings: ${wrongUrlString}`, {
      cause,
    });
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "CannotParseUrlsError" });
  }
}

export class UnknownError extends CustomError {
  public constructor(cause: unknown) {
    super(`Unknown error`, { cause });
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "UnknownError" });
  }
}
