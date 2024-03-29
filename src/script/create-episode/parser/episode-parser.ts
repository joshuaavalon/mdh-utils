import type { Logger } from "pino";
import type { DateTime } from "luxon";
import type { Browser, Page } from "puppeteer";
import type { CountryResponse, LanguageResponse } from "#client";

export interface EpisodeMetadata {
  readonly epStart: number;
  readonly epEnd: number;
  readonly epCurrent: number;
  readonly index: number;
  readonly country: CountryResponse;
  readonly language: LanguageResponse;
  readonly tvSeasonId: string;
}

export interface EpisodeContext {
  browser: Browser;
  logger: Logger;
}

export interface EpisodeParser {
  getUrl: (meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<string>;
  onPageLoad: (page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<void>;
  getTitle: (page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<string>;
  postProcessTitle: (value: string) => Promise<string>;
  getSortTitle: (title: string, page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<string>;
  postProcessSortTitle: (value: string) => Promise<string>;
  getDescription: (page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<string>;
  postProcessDescription: (value: string) => Promise<string>;
  getImageUrls: (page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<string[]>;
  getAirDate: (page: Page, meta: EpisodeMetadata, ctx: EpisodeContext) => Promise<DateTime>;
}
