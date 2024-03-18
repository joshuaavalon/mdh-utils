import { Type } from "@sinclair/typebox";
import { TypeSystem } from "@sinclair/typebox/system";
import { pageFunctionSchema } from "./page-function.js";
import { browser } from "./browser.js";

import type { Static } from "@sinclair/typebox";
import { DateTime } from "luxon";

const dateTime = TypeSystem.Type<DateTime>("DateTime", (_opts, value) => value instanceof DateTime);

export const createEpisodeInputSchema = Type.Object({
  episodeStart: Type.Number(),
  episodeEnd: Type.Number(),
  country: Type.String(),
  language: Type.String(),
  tvSeason: Type.String(),
  getUrl: pageFunctionSchema(Type.Promise(Type.String())),
  onPageLoad: pageFunctionSchema(Type.Promise(Type.Void())),
  getTitle: pageFunctionSchema(Type.Promise(Type.String())),
  getSortTitle: Type.Function(
    [browser(), Type.String()],
    Type.Promise(Type.String())
  ),
  getDescription: pageFunctionSchema(Type.Promise(Type.String())),
  getImageUrls: pageFunctionSchema(Type.Promise(Type.Array(Type.String()))),
  getAirDate: pageFunctionSchema(Type.Promise(dateTime()))
});

export type CreateEpisodeInput = Static<typeof createEpisodeInputSchema>;
