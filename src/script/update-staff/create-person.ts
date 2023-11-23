import { pino } from "pino";

import type {
  MediaDataHub,
  PersonRecord,
  PersonResponse
} from "../../client/index.js";

const logger = pino();

export async function createPerson(
  client: MediaDataHub,
  record: Pick<PersonRecord, "country" | "name">
): Promise<PersonResponse> {
  const { name, country } = record;
  const item = await client.c("person").first`name = ${name}`;
  if (item) {
    logger.info({ item, record }, "Person already exists");
    return item;
  }
  logger.info({ record }, "Person does not exists");
  return client.c("person").create({ name, sortName: name, country });
}
