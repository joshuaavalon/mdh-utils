import type { ValueError } from "@sinclair/typebox/value";

function format(errors: ValueError[]): string {
  return errors.map(e => `${e.message} (${e.path})`).join("\n");
}

export class InvalidInputError extends Error {
  public readonly errors;

  public constructor(errors: ValueError[]) {
    super(format(errors));
    this.errors = errors;
  }
}
