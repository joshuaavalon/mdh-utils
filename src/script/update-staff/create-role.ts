import type {
  MediaDataHub,
  RoleRecord,
  RoleResponse
} from "../../client/index.js";

export async function createRole(
  client: MediaDataHub,
  record: RoleRecord
): Promise<RoleResponse> {
  const { name, jellyfin = "Actor" } = record;
  const item = await client.c("role")
    .first`name = ${name} && jellyfin = ${jellyfin}`;
  if (item) {
    return item;
  }
  return client.c("role").create({ name, jellyfin });
}
