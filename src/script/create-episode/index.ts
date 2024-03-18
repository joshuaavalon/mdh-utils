import { pino } from "pino";
import { launch } from "puppeteer";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { InvalidInputError } from "../error.js";
import { fetchImage, processImage } from "../../image/index.js";
import { createEpisodeInputSchema } from "./type/index.js";

import type { PuppeteerLaunchOptions } from "puppeteer";
import type { CreateEpisodeInput } from "./type/index.js";
import type { MediaDataHub } from "../../client/index.js";

export * from "./type/index.js";

const logger = pino();
const validator = TypeCompiler.Compile(createEpisodeInputSchema);

export interface CreateEpisodeOptions {
  puppeteer?: PuppeteerLaunchOptions;
  image?: RequestInit;
}

export async function createEpisode(
  client: MediaDataHub,
  input: CreateEpisodeInput,
  opts?: CreateEpisodeOptions
): Promise<void> {
  if (!validator.Check(input)) {
    const errors = [...validator.Errors(input)];
    throw new InvalidInputError(errors);
  }
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
