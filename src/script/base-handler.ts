import { pino } from "pino";
import { Collections } from "../client/index.js";

import type { Logger } from "pino";
import type { MediaDataHub } from "../client/index.js";

export interface BaseHandlerOptions {
  client: MediaDataHub;

  /**
   * Logger instance. Default to `info` level.
   */
  logger?: Logger;

}

export class BaseHandler {
  protected readonly client;
  protected readonly logger;

  public constructor(opts: BaseHandlerOptions) {
    const { client, logger } = opts;
    this.client = client;
    this.logger = logger ?? pino({ level: "info" });
  }

  protected async findCountryIdByName(name: string): Promise<string> {
    const country = await this.client.c(Collections.Country).first`name = ${name}`;
    if (!country) {
      throw new Error(`Country does not exists (${name})`);
    }
    return country.id;
  }

  protected async findLanguageIdByName(name: string): Promise<string> {
    const lang = await this.client.c(Collections.Language).first`name = ${name}`;
    if (!lang) {
      throw new Error(`Language does not exists (${name})`);
    }
    return lang.id;
  }
}
