import { pino } from "pino";
import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { RoleJellyfinOptions } from "../../client/index.js";
import { InvalidInputError } from "../error.js";
import { createPerson } from "./create-person.js";
import { createRole } from "./create-role.js";
import {
  createMovieStaff,
  createTvSeasonStaff,
  createTvSeriesStaff
} from "./create-staff.js";

import type { Static } from "@sinclair/typebox";
import type { MediaDataHub } from "../../client/index.js";

const schema = Type.Object({
  tvSeason: Type.Optional(Type.Union([Type.Null(), Type.String()])),
  tvSeries: Type.Optional(Type.Union([Type.Null(), Type.String()])),
  movie: Type.Optional(Type.Union([Type.Null(), Type.String()])),
  country: Type.String(),
  actors: Type.Array(
    Type.Union([
      Type.Tuple([Type.String(), Type.String()]),
      Type.Tuple([Type.String(), Type.String(), Type.Enum(RoleJellyfinOptions)])
    ])
  )
});

export type UpdateStaffInput = Static<typeof schema>;

const logger = pino();
const validator = TypeCompiler.Compile(schema);

export async function updateStaff(
  client: MediaDataHub,
  input: UpdateStaffInput
): Promise<void> {
  if (!validator.Check(input)) {
    const errors = [...validator.Errors(input)];
    throw new InvalidInputError(errors);
  }
  const country = await client.c("country").first`name = ${input.country}`;
  if (!country) {
    throw new Error(`Country does not exists (${input.country})`);
  }
  const { tvSeason, tvSeries, movie, actors } = input;
  const priorities: Record<string, number> = {};
  for (const [roleName, personName, jellyfin] of actors) {
    const person = await createPerson(client, {
      name: personName,
      country: country.id
    });
    const role = await createRole(client, { name: roleName, jellyfin });
    priorities[role.jellyfin] ??= 0;
    const priority = priorities[role.jellyfin];
    if (tvSeries) {
      logger.info({ person }, "Create TvSeriesStaff");
      await createTvSeriesStaff(client, {
        tvSeries,
        person: person.id,
        role: role.id,
        priority
      });
    }
    if (tvSeason) {
      logger.info({ person }, "Create TvSeasonStaff");
      await createTvSeasonStaff(client, {
        tvSeason,
        person: person.id,
        role: role.id,
        priority
      });
    }
    if (movie) {
      logger.info({ person }, "Create MovieStaff");
      await createMovieStaff(client, {
        movie,
        person: person.id,
        role: role.id,
        priority
      });
    }
    priorities[role.jellyfin]++;
  }
}
