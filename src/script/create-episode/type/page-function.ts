import { Type } from "@sinclair/typebox";
import { TypeSystem } from "@sinclair/typebox/system";
import { Page } from "puppeteer";
import { episodeContextSchema } from "./episode-context.js";

import type { TSchema } from "@sinclair/typebox";

const page = TypeSystem.Type<Page>("Page", (_opts, value) => value instanceof Page);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const pageFunctionSchema = <T extends TSchema>(returnType: T) => Type.Function([episodeContextSchema, page()], returnType);
