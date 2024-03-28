import PocketBase from "pocketbase";
import { ExtendedRecordService } from "./record-service.js";

import type { BaseSystemFields, Collections } from "./type.js";

export class MediaDataHub extends PocketBase {
  private services: { [key: string]: ExtendedRecordService<Collections> } = {};

  public c<C extends Collections>(name: `${C}`): ExtendedRecordService<C> {
    if (!this.services[name]) {
      this.services[name] = new ExtendedRecordService(this, name);
    }
    return this.services[name] as ExtendedRecordService<C>;
  }

  public getAdminThumbUrl(record: BaseSystemFields<unknown>, fileName: string): string {
    return this.files.getUrl(record, fileName, { thumb: "100x100" });
  }
}
