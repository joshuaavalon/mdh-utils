import { launch } from "puppeteer";
import { fetchImage, processImage } from "#image";
import { BaseHandler } from "../base-handler.js";
import { assertInput } from "./input.js";

import type { PuppeteerLaunchOptions } from "puppeteer";
import type { BaseHandlerOptions } from "../base-handler.js";
import type { CreateEpisodeInput } from "./input.js";
import type { EpisodeContext, EpisodeMetadata, EpisodeParser } from "./parser/index.js";

export * from "./parser/index.js";
export * from "./utils/index.js";

export interface EpisodeCreatorOptions extends BaseHandlerOptions {
  puppeteer?: PuppeteerLaunchOptions;
  image?: RequestInit;
}

export class EpisodeCreator extends BaseHandler {
  private readonly puppeteer: PuppeteerLaunchOptions;
  private readonly image?: RequestInit;

  public constructor(opts: EpisodeCreatorOptions) {
    const { puppeteer, image, ...others } = opts;
    super(others);
    this.puppeteer = puppeteer ?? { defaultViewport: { width: 1920, height: 1080 } };
    this.image = image;
  }

  public async create(input: CreateEpisodeInput, parser: EpisodeParser): Promise<void> {
    this.logger.info("Start create episode");
    this.logger.debug({ api: this.client.baseUrl, input });
    assertInput(input);
    const { epStart, epEnd, tvSeasonId } = input;
    const country = await this.findCountryByName(input.country);
    const language = await this.findLanguageByName(input.language);
    const browser = await launch(this.puppeteer);
    let index = 0;
    const ctx: EpisodeContext = { browser, logger: this.logger };
    try {
      for (let i = epStart; i <= epEnd; i++) {
        const meta: EpisodeMetadata = { epStart, epEnd, epCurrent: i, country, language, tvSeasonId, index };
        await this.createEpisode(parser, ctx, meta);
        index++;
      }
    } finally {
      await Promise.all(pages.map(page => page.close()));
      await browser.close();
    }
  }

  private async createEpisode(parser: EpisodeParser, ctx: EpisodeContext, meta: EpisodeMetadata): Promise<void> {
    const { browser, logger } = ctx;
    const { epCurrent, country, language, tvSeasonId } = meta;
    const page = await browser.newPage();
    try {
      this.logger.info({ episode: meta.epCurrent }, "Create episode");
      const url = await parser.getUrl(meta, ctx);
      this.logger.debug({ url });
      await page.goto(url);
      await parser.onPageLoad(page, meta, ctx);
      const name = await parser.getTitle(page, meta, ctx).then(parser.postProcessTitle);
      const sortName = await parser.getSortTitle(name, page, meta, ctx).then(parser.postProcessSortTitle);
      const description = await parser.getDescription(page, meta, ctx).then(parser.postProcessDescription);
      const airDate = await parser.getAirDate(page, meta, ctx);
      const imageUrls = await parser.getImageUrls(page, meta, ctx);
      const posters = await Promise.all(imageUrls.map((url, i) => fetchImage(url, this.image).then(async result => {
        const { data, type } = await processImage(result);
        return [new Blob([data]), `${i}.${type.ext}`] as [Blob, string];
      })));
      logger.info({ url, name, sortName, description, airDate: airDate.toISO(), rating: 0, order: epCurrent });

      const data = new FormData();
      data.append("name", name);
      data.append("sortName", sortName);
      data.append("description", description);
      data.append("airDate", airDate.toISO() ?? "");
      data.append("rating", "0");
      data.append("language", language.id);
      data.append("country", country.id);
      data.append("order", `${epCurrent}`);
      data.append("tvSeason", tvSeasonId);
      for (const [poster, fileName] of posters) {
        data.append("posters", poster, fileName);
      }
      const record = await this.client.c("tvEpisode").create(data);
      for (const poster of record.posters) {
        const url = this.client.getAdminThumbUrl(record, poster);
        await fetch(url);
      }
    } finally {
      await page.close();
    }
  }
}
