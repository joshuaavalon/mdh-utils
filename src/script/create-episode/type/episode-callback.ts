import type { Logger } from "pino";
import type { DateTime } from "luxon";
import type { Browser, Page } from "puppeteer";
import type { CountryRecord, LanguageRecord, TvSeasonRecord } from "#client";

export interface EpisodeMetadata {
  readonly epStart: number;
  readonly epEnd: number;
  readonly epCurrent: number;
  readonly country: CountryRecord;
  readonly language: LanguageRecord;
  readonly tvSeason: TvSeasonRecord;
}

export interface EpisodeContext {
  browser: Browser;
  logger: Logger;
}

export interface EpisodeCallback {
  getUrl: (meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<string>;
  onPageLoad: (page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<void>;
  getTitle: (page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<string>;
  getSortTitle: (title: string, page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<string>;
  getDescription: (page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<string>;
  getImageUrls: (page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<string[]>;
  getAirDate: (page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<DateTime>;
}
