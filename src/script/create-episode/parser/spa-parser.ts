import { BaseParser } from "./base-parser.js";

import type { DateTime } from "luxon";
import type { Page } from "puppeteer";
import type { EpisodeContext, EpisodeMetadata } from "./episode-parser.js";

export abstract class SpaParser<T extends HTMLElement = HTMLElement> extends BaseParser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async onPageLoad(page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const selectRoot = this.selectRoot;
    await page.addScriptTag({ content: `${selectRoot}`.replace(" selectRoot(", " function selectRoot(") });
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getTitle(page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const selectTitle = this.selectTitle;
    await page.addScriptTag({ content: `${selectTitle}`.replace(" selectTitle(", " function selectTitle(") });
    const value = await page.evaluate(async meta => {
      const root = await window.selectRoot(document, meta);
      return window.selectTitle(root, meta);
    }, meta);
    if (!value) {
      throw new Error(`Title is empty (${value})`);
    }
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getDescription(page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const selectDescription = this.selectDescription;
    await page.addScriptTag({ content: `${selectDescription}`.replace(" selectDescription(", " function selectDescription(") });
    const value = await page.evaluate(async meta => {
      const root = await window.selectRoot(document, meta);
      return window.selectDescription(root, meta);
    }, meta);
    if (!value) {
      throw new Error(`Title is empty (${value})`);
    }
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getImageUrls(page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<string[]> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const selectImageUrls = this.selectImageUrls;
    await page.addScriptTag({ content: `${selectImageUrls}`.replace(" selectImageUrls(", " function selectImageUrls(") });
    const value = await page.evaluate(async meta => {
      const root = await window.selectRoot(document, meta);
      return window.selectImageUrls(root, meta);
    }, meta);
    if (!value) {
      throw new Error(`Title is empty (${value})`);
    }
    return value;
  }

  public abstract getUrl(meta: EpisodeMetadata, ctx: EpisodeContext): Promise<string>;
  public abstract getSortTitle(title: string, page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<string>;
  public abstract getAirDate(page: Page, meta: EpisodeMetadata, ctx: EpisodeContext): Promise<DateTime>;
  public abstract selectRoot(document: Document, meta: EpisodeMetadata): Promise<T>;
  public abstract selectTitle(root: T, meta: EpisodeMetadata): Promise<string>;
  public abstract selectDescription(root: T, meta: EpisodeMetadata): Promise<string>;
  public abstract selectImageUrls(root: T, meta: EpisodeMetadata): Promise<string[]>;
}

declare global {
  interface Window {
    selectRoot: (document: Document, meta: EpisodeMetadata) => Promise<HTMLElement>;
    selectTitle: (document: HTMLElement, meta: EpisodeMetadata) => Promise<string>;
    selectDescription: (document: HTMLElement, meta: EpisodeMetadata) => Promise<string>;
    selectImageUrls: (document: HTMLElement, meta: EpisodeMetadata) => Promise<string[]>;
  }
}
