import type { EvaluateFunc } from "puppeteer";
import type { EpisodeCallback, EpisodeMetadata } from "../type/index.js";

export function pageJump(url: string, fn: EvaluateFunc<[EpisodeMetadata]>): EpisodeCallback["getUrl"] {
  return async function (meta, ctx) {
    const { browser } = ctx;
    const page = await browser.newPage();
    try {
      await page.goto(url);
      const newUrl = await page.evaluate(fn, meta);
      if (typeof newUrl !== "string") {
        throw new Error(`Not string (${newUrl})`);
      }
      return newUrl;
    } catch (err) {
      throw new Error(`Fail to load (${url})`, { cause: err });
    } finally {
      page.close();
    }
  };
}
