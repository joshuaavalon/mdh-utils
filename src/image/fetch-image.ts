import imageType from "image-type";
import { InvalidImageError } from "./error.js";

import type { ImageTypeResult } from "image-type";

export interface FetchImageResult {
  type: ImageTypeResult;
  data: Uint8Array;
}

export async function fetchImage(input: Request | URL | string, init?: RequestInit): Promise<FetchImageResult> {
  const res = await fetch(input, init);
  const data = new Uint8Array(await res.arrayBuffer());
  const type = await imageType(data);
  if (!type) {
    throw new InvalidImageError();
  }
  return { type, data };
}
