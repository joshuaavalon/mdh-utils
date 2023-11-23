import { MediaDataHub } from "./media-data-hub.js";

export * from "./media-data-hub.js";
export * from "./type.js";

export async function createMediaDataHub(
  baseUrl: string,
  email: string,
  password: string
): Promise<MediaDataHub> {
  const pb = new MediaDataHub(baseUrl);
  await pb.admins.authWithPassword(email, password, {});
  return pb;
}
