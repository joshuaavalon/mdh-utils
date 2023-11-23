import sharp from "sharp";
import imageType from "image-type";
import { InvalidImageError } from "./error.js";

import type { ImageTypeResult } from "image-type";
import type { FetchImageResult } from "./fetch-image.js";

export interface ProcessImageResult {
  type: ImageTypeResult;
  data: Uint8Array;
}

export async function processImage(
  input: FetchImageResult
): Promise<ProcessImageResult> {
  let { data } = input;
  const { type } = input;
  if (type.mime === "image/webp" || type.mime === "image/jpeg") {
    return input;
  }
  data = await sharp(data)
    .webp({ lossless: true, force: true, effort: 6 })
    .toBuffer();
  const newType = await imageType(data);
  if (!newType) {
    throw new InvalidImageError();
  }
  return { type: newType, data };
}
