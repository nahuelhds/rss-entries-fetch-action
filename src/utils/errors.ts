import { CustomError } from "ts-custom-error";

export class InvalidUrlError extends CustomError {
  public constructor(
    public invalidUrl: string,
    cause: unknown,
  ) {
    super(`Invalid URL given: ${invalidUrl}`, { cause });
    this.invalidUrl = invalidUrl;
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "InvalidUrlError" });
  }
}

export class NoUrlsGivenError extends CustomError {
  public constructor(cause: unknown) {
    super(`No URL given`, { cause });
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "NoUrlsGivenError" });
  }
}

export class ParseUrlsError extends CustomError {
  public constructor(public wrongValue: unknown) {
    super(`Failed to parse the given value`);
    this.wrongValue = wrongValue;
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "ParseUrlsError" });
  }
}

export class UnknownError extends CustomError {
  public constructor(cause: unknown) {
    super(`Unknown error`, { cause });
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "UnknownError" });
  }
}
