import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { InvalidInputError } from "../error/index.js";

import type { Static } from "@sinclair/typebox";

const createEpisodeInputSchema = Type.Object({
  epStart: Type.Number(),
  epEnd: Type.Number(),
  country: Type.String(),
  language: Type.String(),
  tvSeasonId: Type.String()
});

export type CreateEpisodeInput = Static<typeof createEpisodeInputSchema>;

const validator = TypeCompiler.Compile(createEpisodeInputSchema);

export function assertInput(input: unknown): asserts input is CreateEpisodeInput {
  if (!validator.Check(input)) {
    const errors = [...validator.Errors(input)];
    throw new InvalidInputError(errors);
  }
}
