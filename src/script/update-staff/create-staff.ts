import { filter } from "../../client/filter.js";
import type {
  MediaDataHub,
  MovieStaffResponse,
  TvSeasonStaffResponse,
  TvSeriesStaffResponse
} from "../../client/index.js";

export interface Staff {
  role: string;
  person: string;
  priority: number;
}

export async function createTvSeriesStaff(
  client: MediaDataHub,
  record: Staff & { tvSeries: string }
): Promise<TvSeriesStaffResponse> {
  const { person, role, tvSeries } = record;
  const item = await client.c("tvSeriesStaff")
    .first`person = ${person} && role.jellyfin = ${role} && tvSeries = ${tvSeries}`;
  if (item) {
    return item;
  }
  const f = filter`role.jellyfin = ${role} && tvSeries = ${tvSeries}`;
  const latestItem = await client
    .c("tvSeriesStaff")
    .findFirst(f, { sort: "-priority" });
  const priority = (latestItem?.priority ?? -1) + 1;
  return client.c("tvSeriesStaff").create({ ...record, priority });
}

export async function createTvSeasonStaff(
  client: MediaDataHub,
  record: Staff & { tvSeason: string }
): Promise<TvSeasonStaffResponse> {
  const { person, role, tvSeason } = record;
  const item = await client.c("tvSeasonStaff")
    .first`person = ${person} && role.jellyfin = ${role} && tvSeason = ${tvSeason}`;
  if (item) {
    return item;
  }
  const f = filter`role.jellyfin = ${role} && tvSeason = ${tvSeason}`;
  const latestItem = await client
    .c("tvSeasonStaff")
    .findFirst(f, { sort: "-priority" });
  const priority = (latestItem?.priority ?? -1) + 1;
  return client.c("tvSeasonStaff").create({ ...record, priority });
}

export async function createMovieStaff(
  client: MediaDataHub,
  record: Staff & { movie: string }
): Promise<MovieStaffResponse> {
  const { person, role, movie } = record;
  const item = await client.c("movieStaff")
    .first`person = ${person} && role.jellyfin = ${role} && movie = ${movie}`;
  if (item) {
    return item;
  }
  const f = filter`role.jellyfin = ${role} && movie = ${movie}`;
  const latestItem = await client
    .c("movieStaff")
    .findFirst(f, { sort: "-priority" });
  const priority = (latestItem?.priority ?? -1) + 1;
  return client.c("movieStaff").create({ ...record, priority });
}
