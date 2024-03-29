import type { DateTime } from "luxon";
import type { Page } from "puppeteer";
import type { EpisodeContext, EpisodeMetadata, EpisodeParser } from "./episode-parser.js";

export abstract class BaseParser implements EpisodeParser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async onPageLoad(page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<void> {
    // no-op
  }

  public async postProcessTitle(value: string): Promise<string> {
    return value.trim().replaceAll(/\s+/gu, " ");
  }

  public async postProcessSortTitle(value: string): Promise<string> {
    return value.trim().replaceAll(/\s+/gu, " ");
  }

  public async postProcessDescription(value: string): Promise<string> {
    return value
      .trim()
      .replace(/^ *(?<val>\S+)/gmu, "$<val>")
      .replace(/(?<val>\S+) *$/gmu, "$<val>")
      .replaceAll(/、\s+/gu, "、")
      .replaceAll(/\n{3,}/gu, "\n\n")
      .replaceAll("\n", "<br/>\n")
      .replaceAll("</h3><br/>\n", "</h3>\n")
      .replaceAll("</h2><br/>\n", "</h2>\n")
      .replaceAll("</h1><br/>\n", "</h1>\n");
  }

  public abstract getUrl(meta: EpisodeMetadata, ctx: EpisodeContext): Promise<string>;
  public abstract getTitle(page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<string>;
  public abstract getSortTitle(title: string, page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<string>;
  public abstract getDescription(page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<string>;
  public abstract getImageUrls(page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<string[]>;
  public abstract getAirDate(page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<DateTime>;
}
