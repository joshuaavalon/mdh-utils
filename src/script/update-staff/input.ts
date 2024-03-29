import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { RoleJellyfinOptions } from "../../client/index.js";
import { InvalidInputError } from "../error/index.js";

import type { Static } from "@sinclair/typebox";

const schema = Type.Object({
  tvSeason: Type.Optional(Type.Union([Type.Null(), Type.String()])),
  tvSeries: Type.Optional(Type.Union([Type.Null(), Type.String()])),
  movie: Type.Optional(Type.Union([Type.Null(), Type.String()])),
  country: Type.String(),
  actors: Type.Array(Type.Union([
    Type.Tuple([Type.String(), Type.String()]),
    Type.Tuple([
      Type.String(),
      Type.String(),
      Type.Enum(RoleJellyfinOptions)
    ])
  ]))
});

const validator = TypeCompiler.Compile(schema);

export type UpdateStaffInput = Static<typeof schema>;

export function assertInput(input: unknown): asserts input is UpdateStaffInput {
  if (!validator.Check(input)) {
    const errors = [...validator.Errors(input)];
    throw new InvalidInputError(errors);
  }
}
