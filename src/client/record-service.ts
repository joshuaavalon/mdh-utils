import { RecordService } from "pocketbase";
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
}
