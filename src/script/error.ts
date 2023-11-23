import type { ValueError } from "@sinclair/typebox/value";

export class InvalidInputError extends Error {
  public readonly errors;
  public constructor(errors: ValueError[]) {
    super(JSON.stringify(errors));
    this.errors = errors;
  }
}
