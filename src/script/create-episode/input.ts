import { TypeCompiler } from "@sinclair/typebox/compiler";
import { InvalidInputError } from "../error/index.js";
import { createEpisodeInputSchema } from "./type/index.js";

import type { Static } from "@sinclair/typebox";

const validator = TypeCompiler.Compile(createEpisodeInputSchema);

export type UpdateStaffInput = Static<typeof createEpisodeInputSchema>;

export function assertInput(input: unknown): asserts input is UpdateStaffInput {
  if (!validator.Check(input)) {
    const errors = [...validator.Errors(input)];
    throw new InvalidInputError(errors);
  }
}
