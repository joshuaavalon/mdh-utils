import { Collections } from "../../client/index.js";
import { filter } from "../../client/filter.js";
import { BaseHandler } from "../base-handler.js";
import { assertInput } from "./input.js";

import type {
  MovieStaffResponse,
  PersonRecord,
  PersonResponse,
  RoleRecord,
  RoleResponse,
  TvSeasonStaffResponse,
  TvSeriesStaffResponse
} from "../../client/index.js";
import type { BaseHandlerOptions } from "../base-handler.js";
import type { UpdateStaffInput } from "./input.js";


export interface StaffUpdaterOptions extends BaseHandlerOptions {

}

export interface Staff {
  role: RoleResponse;
  person: string;
  priority: number;
}

export class StaffUpdater extends BaseHandler {
  public async update(input: UpdateStaffInput): Promise<void> {
    this.logger.info("Start updating staff");
    this.logger.debug({ api: this.client.baseUrl, input });
    assertInput(input);
    const { tvSeason, tvSeries, movie, actors, country } = input;
    const priorities: Record<string, number> = {};
    const countryId = await this.findCountryIdByName(country);
    for (const [roleName, personName, jellyfin] of actors) {
      const person = await this.createPerson({ name: personName, country: countryId });
      const role = await this.createRole({ name: roleName, jellyfin });
      priorities[role.jellyfin] ??= 0;
      const priority = priorities[role.jellyfin];
      if (tvSeries) {
        await this.createTvSeriesStaff({ tvSeries, person: person.id, role, priority });
      }
      if (tvSeason) {
        await this.createTvSeasonStaff({ tvSeason, person: person.id, role, priority });
      }
      if (movie) {
        await this.createMovieStaff({ movie, person: person.id, role, priority });
      }
      priorities[role.jellyfin]++;
    }
  }

  private async createPerson(record: Pick<PersonRecord, "country" | "name">): Promise<PersonResponse> {
    const { name, country } = record;
    const collection = Collections.Person;
    let item = await this.client.c(collection).first`name = ${name}`;
    if (item) {
      this.logger.info({ collection, id: item.id, name }, `Found ${collection} record by name`);
      this.logger.debug({ item, record });
      return item;
    }
    item = await this.client.c(collection).first`matchName = ${name}`;
    if (item) {
      this.logger.info({ collection, id: item.id, name }, `Found ${collection} record by matchName`);
      this.logger.debug({ item, record });
      return item;
    }
    this.logger.info({ name }, `Cannot find ${collection} record. Create new record`);
    this.logger.debug({ record });
    return this.client.c(collection).create({ name, sortName: name, country });
  }

  private async createRole(record: RoleRecord): Promise<RoleResponse> {
    const { name, jellyfin = "Actor" } = record;
    const collection = Collections.Role;
    const item = await this.client.c(collection).first`name = ${name} && jellyfin = ${jellyfin}`;
    if (item) {
      this.logger.info({ collection, id: item.id, name }, `Found ${collection} record by name`);
      this.logger.debug({ item, record });
      return item;
    }
    this.logger.info({ name }, `Cannot find ${collection} record. Create new record`);
    this.logger.debug({ record });
    return this.client.c(collection).create({ name, jellyfin });
  }

  private async createTvSeriesStaff(record: Staff & { tvSeries: string }): Promise<TvSeriesStaffResponse> {
    const { person, role, tvSeries } = record;
    const collection = Collections.TvSeriesStaff;
    const item = await this.client.c(collection)
      .first`person = ${person} && role.jellyfin = ${role.jellyfin} && tvSeries = ${tvSeries}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      this.logger.debug({ item, record });
      return item;
    }
    this.logger.info({ person, jellyfin: role.jellyfin, tvSeries }, `Cannot find ${collection} record. Create new record`);
    this.logger.debug({ record });
    const f = filter`role.jellyfin = ${role.jellyfin} && tvSeries = ${tvSeries}`;
    const latestItem = await this.client.c(collection).findFirst(f, { sort: "-priority" });
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.client.c(collection).create({ ...record, role: role.id, priority });
  }

  private async createTvSeasonStaff(record: Staff & { tvSeason: string }): Promise<TvSeasonStaffResponse> {
    const { person, role, tvSeason } = record;
    const collection = Collections.TvSeasonStaff;
    const item = await this.client.c(collection)
      .first`person = ${person} && role.jellyfin = ${role.jellyfin} && tvSeason = ${tvSeason}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      this.logger.debug({ item, record });
      return item;
    }
    this.logger.info({ person, jellyfin: role.jellyfin, tvSeason }, `Cannot find ${collection} record. Create new record`);
    this.logger.debug({ record });
    const f = filter`role.jellyfin = ${role.jellyfin} && tvSeason = ${tvSeason}`;
    const latestItem = await this.client.c(collection).findFirst(f, { sort: "-priority" });
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.client.c(collection).create({ ...record, role: role.id, priority });
  }

  private async createMovieStaff(record: Staff & { movie: string }): Promise<MovieStaffResponse> {
    const { person, role, movie } = record;
    const collection = Collections.MovieStaff;
    const item = await this.client.c(collection)
      .first`person = ${person} && role.jellyfin = ${role.jellyfin} && movie = ${movie}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      this.logger.debug({ item, record });
      return item;
    }
    this.logger.info({ person, jellyfin: role.jellyfin, movie }, `Cannot find ${collection} record. Create new record`);
    this.logger.debug({ record });
    const f = filter`role.jellyfin = ${role.jellyfin} && movie = ${movie}`;
    const latestItem = await this.client.c(collection).findFirst(f, { sort: "-priority" });
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.client.c(collection).create({ ...record, role: role.id, priority });
  }
}
