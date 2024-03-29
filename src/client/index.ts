import { MediaDataHub } from "./media-data-hub.js";

import type { AuthOptions, BaseAuthStore } from "pocketbase";

export * from "./media-data-hub.js";
export * from "./type.js";

export interface InitMdhAuthOptions extends AuthOptions {
  email: string;
  password: string;
  store?: BaseAuthStore | null;
}

export interface InitMdhOptions {
  baseUrl: string;
  lang?: string;
  auth: InitMdhAuthOptions;
}

/**
 * Create MediaDataHub client and automatically authenticate
 * @param opts Initialize options
 * @returns MediaDataHub client
 */
export async function initMdh(opts: InitMdhOptions): Promise<MediaDataHub> {
  const { baseUrl, lang, auth: { store, email, password, ...authOpts } } = opts;
  const pb = new MediaDataHub(baseUrl, store, lang);
  await pb.admins.authWithPassword(email, password, authOpts);
  return pb;
}
