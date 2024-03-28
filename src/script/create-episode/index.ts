import { pino } from "pino";
import { launch } from "puppeteer";
import { BaseHandler } from "../base-handler.js";
import { fetchImage, processImage } from "../../image/index.js";
import { assertInput } from "./input.js";

import type { Browser, PuppeteerLaunchOptions } from "puppeteer";
import type { BaseHandlerOptions } from "../base-handler.js";
import type { MediaDataHub } from "#client";
import type { CreateEpisodeInput } from "./type/index.js";

export * from "./type/index.js";

const logger = pino();

export interface CreateEpisodeOptions {
  puppeteer?: PuppeteerLaunchOptions;
  image?: RequestInit;
}

export async function createEpisode(
  client: MediaDataHub,
  input: CreateEpisodeInput,
  opts?: CreateEpisodeOptions
): Promise<void> {
  // if (!validator.Check(input)) {
  //   const errors = [...validator.Errors(input)];
  //   throw new InvalidInputError(errors);
  // }
  const country = await client.c("country").first`name = ${input.country}`;
  if (!country) {
    throw new Error(`Country does not exists (${input.country})`);
  }
  const language = await client.c("language").first`name = ${input.language}`;
  if (!language) {
    throw new Error(`Language does not exists (${input.language})`);
  }
  const browser = await launch(opts?.puppeteer ?? { defaultViewport: { width: 1920, height: 1080 } });
  let page = await browser.newPage();
  let index = 0;
  try {
    for (let i = input.episodeStart; i <= input.episodeEnd; i++) {
      const ctx = { browser, index, episode: i };
      const url = await input.getUrl(ctx, page);
      logger.info({ url, episode: i }, "Fetching");
      if (page.url() !== url) {
        page.close();
        page = await browser.newPage();
        await page.goto(url);
      }
      await input.onPageLoad(ctx, page);
      index++;
      const name = await input.getTitle(ctx, page);
      const description = await input.getDescription(ctx, page);
      const sortName = await input.getSortTitle(browser, name);
      const airDate = await input.getAirDate(ctx, page);
      const imageUrls = await input.getImageUrls(ctx, page);
      const posters = await Promise.all(imageUrls.map((url, i) => fetchImage(url, opts?.image).then(async result => {
        const { data, type } = await processImage(result);
        return [new Blob([data]), `${i}.${type.ext}`] as [Blob, string];
      })));
      logger.info({
        url,
        name,
        sortName,
        description,
        airDate: airDate.toISO(),
        rating: 0,
        language,
        country,
        order: i
      });
      const data = new FormData();
      data.append("name", name);
      data.append("sortName", sortName);
      data.append("description", description);
      data.append("airDate", airDate.toISO() ?? "");
      data.append("rating", "0");
      data.append("language", language.id);
      data.append("country", country.id);
      data.append("order", `${i}`);
      data.append("tvSeason", input.tvSeason);
      for (const [poster, fileName] of posters) {
        data.append("posters", poster, fileName);
      }
      const record = await client.c("tvEpisode").create(data);
      for (const poster of record.posters) {
        const url = client.getAdminThumbUrl(record, poster);
        await fetch(url);
      }
    }
  } finally {
    browser.close();
  }
}

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

  public async create(input: CreateEpisodeInput): Promise<void> {
    this.logger.info("Start create episode");
    this.logger.debug({ api: this.client.baseUrl, input });
    assertInput(input);
    const { language, country, episodeStart, episodeEnd } = input;
    const countryId = await this.findCountryIdByName(country);
    const languageId = await this.findLanguageIdByName(language);
    const browser = await launch(this.puppeteer);
    let index = 0;
    try {
      for (let i = episodeStart; i <= episodeEnd; i++) {
        await this.createEpisode(browser, input, i, index, countryId, languageId);
        index++;
      }
    } finally {
      await browser.close();
    }
  }

  private async createEpisode(browser: Browser, input: CreateEpisodeInput, episode: number, index: number, country: string, language: string): Promise<void> {
    const page = await browser.newPage();
    const { getUrl, getTitle, getDescription, getSortTitle, getAirDate, getImageUrls, onPageLoad } = input;
    try {
      const ctx = { browser, index, episode };
      const url = await getUrl(ctx, page);
      this.logger.info({ url, episode }, "Create episode");
      await page.goto(url);
      await onPageLoad(ctx, page);
      const name = await getTitle(ctx, page);
      const description = await getDescription(ctx, page);
      const sortName = await getSortTitle(browser, name);
      const airDate = await getAirDate(ctx, page);
      const imageUrls = await getImageUrls(ctx, page);
      const posters = await Promise.all(imageUrls.map((url, i) => fetchImage(url, this.image).then(async result => {
        const { data, type } = await processImage(result);
        return [new Blob([data]), `${i}.${type.ext}`] as [Blob, string];
      })));
      logger.info({
        url,
        name,
        sortName,
        description,
        airDate: airDate.toISO(),
        rating: 0,
        language,
        country,
        order: episode
      });

      const data = new FormData();
      data.append("name", name);
      data.append("sortName", sortName);
      data.append("description", description);
      data.append("airDate", airDate.toISO() ?? "");
      data.append("rating", "0");
      data.append("language", language);
      data.append("country", country);
      data.append("order", `${episode}`);
      data.append("tvSeason", input.tvSeason);
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
