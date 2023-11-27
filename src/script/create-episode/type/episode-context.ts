import { Type } from "@sinclair/typebox";
import { browser } from "./browser.js";

import type { Static } from "@sinclair/typebox";

export const episodeContextSchema = Type.Object({
  browser: Type.Readonly(browser()),
  episode: Type.Readonly(Type.Number()),
  index: Type.Readonly(Type.Number())
});

export type EpisodeContext = Static<typeof episodeContextSchema>;
