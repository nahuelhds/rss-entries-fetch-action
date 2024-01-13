import fs from "fs";
import path from "path";
import { CustomError } from "ts-custom-error";

export function storeFile(destinationPath: string, fileContents: string) {
  if (fs.existsSync(destinationPath)) {
    throw new FileExistsError(destinationPath);
  }

  const dir = path.dirname(destinationPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(destinationPath, fileContents, {
    encoding: "utf8",
  });
}

export class FileExistsError extends CustomError {
  public constructor(path: string) {
    super(`The file "${path}" already exists`);
    // Set name explicitly as minification can mangle class names
    Object.defineProperty(this, "name", { value: "FileExistsError" });
  }
}
