import { ClientResponseError, RecordService } from "pocketbase";
import { LRUCache } from "lru-cache";
import { filter } from "./filter.js";

import type Client from "pocketbase";
import type { RecordListOptions } from "pocketbase";
import type { CollectionResponses, Collections } from "./type.js";

export class ExtendedRecordService<C extends Collections> extends RecordService<
  CollectionResponses[C]
> {
  public constructor(client: Client, collectionIdOrName: string) {
    super(client, collectionIdOrName);
  }

  public async findFirst(
    filter: string,
    opts?: Omit<RecordListOptions, "filter">
  ): Promise<CollectionResponses[C] | undefined> {
    const result = await this.getList(1, 1, {
      filter,
      skipTotal: true,
      ...opts
    });
    return result?.items[0];
  }

  public async first(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<CollectionResponses[C] | undefined> {
    const fStr = filter(strings, ...values);
    const result = await this.getList(1, 1, {
      filter: fStr,
      skipTotal: true
    });
    return result?.items[0];
  }

  private filterBy(field: string, value: string): string {
    return this.client.filter(`${field} = {:value}`, { value });
  }

  public async findBy(
    field: string,
    value: string
  ): Promise<CollectionResponses[C] | undefined> {
    const cache = new LRUCache<string, CollectionResponses[C]>({ max: 100 });
    if (cache.has(value)) {
      return cache.get(value);
    }
    try {
      const filter = this.filterBy(field, value);
      const result = await this.findFirst(filter);
      cache.set(value, result);
      return result;
    } catch (e) {
      if (e instanceof ClientResponseError && e.status === 404) {
        return undefined;
      }
      throw e;
    }
  }
}
