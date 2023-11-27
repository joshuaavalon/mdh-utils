import { TypeSystem } from "@sinclair/typebox/system";
import { Browser } from "puppeteer";

export const browser = TypeSystem.Type<Browser>(
  "Browser",
  (_opts, value) => value instanceof Browser
);
