/* eslint-disable @typescript-eslint/naming-convention */
/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from "pocketbase";
import type { RecordService } from "pocketbase";

export enum Collections {
  Collection = "collection",
  Country = "country",
  Genre = "genre",
  Language = "language",
  Movie = "movie",
  MovieStaff = "movieStaff",
  MusicAlbum = "musicAlbum",
  Person = "person",
  Role = "role",
  Studio = "studio",
  Tag = "tag",
  TvEpisode = "tvEpisode",
  TvEpisodeStaff = "tvEpisodeStaff",
  TvSeason = "tvSeason",
  TvSeasonStaff = "tvSeasonStaff",
  TvSeries = "tvSeries",
  TvSeriesStaff = "tvSeriesStaff",
  User = "user"
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString;
  created: IsoDateString;
  updated: IsoDateString;
  collectionId: string;
  collectionName: Collections;
  expand?: T;
};

export type AuthSystemFields<T = never> = BaseSystemFields<T> & {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
};

// Record types for each collection

export type CollectionRecord = {
  backdrop?: string[];
  banners?: string[];
  contentRatings?: string;
  description?: string;
  genres?: RecordIdString[];
  logos?: string[];
  name: string;
  posters?: string[];
  rating?: number;
  releaseDate: IsoDateString;
  sortName: string;
  tags?: RecordIdString[];
  thumbnails?: string[];
};

export type CountryRecord = {
  alpha2: string;
  alpha3: string;
  name: string;
};

export type GenreRecord = {
  name: string;
  sortName: string;
};

export type LanguageRecord = {
  iso639_1: string;
  iso639_2: string;
  name: string;
};

export type MovieRecord = {
  backdrop?: string[];
  banners?: string[];
  collections?: RecordIdString[];
  contentRatings?: string;
  country: RecordIdString;
  description?: string;
  genres?: RecordIdString[];
  homepage?: string;
  language: RecordIdString;
  logos?: string[];
  matchName?: string;
  name: string;
  posters?: string[];
  rating?: number;
  releaseDate: IsoDateString;
  sortName: string;
  studios?: RecordIdString[];
  tagline?: string;
  tags?: RecordIdString[];
  thumbnails?: string[];
};

export type MovieStaffRecord = {
  movie: RecordIdString;
  person: RecordIdString;
  priority?: number;
  role: RecordIdString;
};

export type MusicAlbumRecord = {
  backdrop?: string[];
  banners?: string[];
  collections?: RecordIdString[];
  country: RecordIdString;
  description?: string;
  genres?: RecordIdString[];
  language: RecordIdString;
  logos?: string[];
  matchName?: string;
  name: string;
  posters?: string[];
  rating?: number;
  releaseDate: IsoDateString;
  sortName: string;
  tags?: RecordIdString[];
  thumbnails?: string[];
};

export type PersonRecord = {
  avatars?: string[];
  backdrop?: string[];
  country: RecordIdString;
  description?: string;
  dob?: IsoDateString;
  dod?: IsoDateString;
  matchName?: string;
  name: string;
  sortName: string;
  tags?: RecordIdString[];
  thumbnails?: string[];
};

export enum RoleJellyfinOptions {
  Actor = "Actor",
  Director = "Director",
  Composer = "Composer",
  Writer = "Writer",
  GuestStar = "GuestStar",
  Producer = "Producer",
  Conductor = "Conductor",
  Lyricist = "Lyricist",
  Arranger = "Arranger",
  Engineer = "Engineer",
  Mixer = "Mixer",
  Remixer = "Remixer"
}
export type RoleRecord = {
  jellyfin?: RoleJellyfinOptions;
  name: string;
};

export type StudioRecord = {
  backdrop?: string[];
  country: RecordIdString;
  description?: string;
  foundedAt?: IsoDateString;
  language: RecordIdString;
  logos?: string[];
  name: string;
  posters?: string[];
  sortName: string;
  thumbnails?: string[];
};

export type TagRecord = {
  name: string;
  sortName: string;
};

export type TvEpisodeRecord = {
  airDate: IsoDateString;
  backdrop?: string[];
  banners?: string[];
  country: RecordIdString;
  description?: string;
  language: RecordIdString;
  logos?: string[];
  name: string;
  order?: number;
  posters?: string[];
  rating?: number;
  sortName: string;
  thumbnails?: string[];
  tvSeason: RecordIdString;
};

export type TvEpisodeStaffRecord = {
  person: RecordIdString;
  priority?: number;
  role: RecordIdString;
  tvEpisode: RecordIdString;
};

export type TvSeasonRecord = {
  airDate: IsoDateString;
  backdrop?: string[];
  banners?: string[];
  contentRatings?: string;
  country: RecordIdString;
  description?: string;
  homepage?: string;
  language: RecordIdString;
  logos?: string[];
  name: string;
  order?: number;
  posters?: string[];
  rating?: number;
  sortName: string;
  studios?: RecordIdString[];
  tagline?: string;
  thumbnails?: string[];
  tvSeries: RecordIdString;
};

export type TvSeasonStaffRecord = {
  person: RecordIdString;
  priority?: number;
  role: RecordIdString;
  tvSeason: RecordIdString;
};

export type TvSeriesRecord = {
  backdrop?: string[];
  banners?: string[];
  collections?: RecordIdString[];
  contentRatings?: string;
  country: RecordIdString;
  description?: string;
  firstAirDate: IsoDateString;
  genres?: RecordIdString[];
  homepage?: string;
  language: RecordIdString;
  lastAirDate?: IsoDateString;
  logos?: string[];
  matchName?: string;
  name: string;
  posters?: string[];
  rating?: number;
  sortName: string;
  studios?: RecordIdString[];
  tagline?: string;
  tags?: RecordIdString[];
  thumbnails?: string[];
};

export type TvSeriesStaffRecord = {
  person: RecordIdString;
  priority?: number;
  role: RecordIdString;
  tvSeries: RecordIdString;
};

export type UserRecord = {
  avatar?: string;
  name?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type CollectionResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<CollectionRecord>;
export type CountryResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<CountryRecord>;
export type GenreResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<GenreRecord>;
export type LanguageResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<LanguageRecord>;
export type MovieResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<MovieRecord>;
export type MovieStaffResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<MovieStaffRecord>;
export type MusicAlbumResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<MusicAlbumRecord>;
export type PersonResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<PersonRecord>;
export type RoleResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<RoleRecord>;
export type StudioResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<StudioRecord>;
export type TagResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TagRecord>;
export type TvEpisodeResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvEpisodeRecord>;
export type TvEpisodeStaffResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvEpisodeStaffRecord>;
export type TvSeasonResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvSeasonRecord>;
export type TvSeasonStaffResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvSeasonStaffRecord>;
export type TvSeriesResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvSeriesRecord>;
export type TvSeriesStaffResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvSeriesStaffRecord>;
export type UserResponse<Texpand = unknown> = AuthSystemFields<Texpand> & Required<UserRecord>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  collection: CollectionRecord;
  country: CountryRecord;
  genre: GenreRecord;
  language: LanguageRecord;
  movie: MovieRecord;
  movieStaff: MovieStaffRecord;
  musicAlbum: MusicAlbumRecord;
  person: PersonRecord;
  role: RoleRecord;
  studio: StudioRecord;
  tag: TagRecord;
  tvEpisode: TvEpisodeRecord;
  tvEpisodeStaff: TvEpisodeStaffRecord;
  tvSeason: TvSeasonRecord;
  tvSeasonStaff: TvSeasonStaffRecord;
  tvSeries: TvSeriesRecord;
  tvSeriesStaff: TvSeriesStaffRecord;
  user: UserRecord;
};

export type CollectionResponses = {
  collection: CollectionResponse;
  country: CountryResponse;
  genre: GenreResponse;
  language: LanguageResponse;
  movie: MovieResponse;
  movieStaff: MovieStaffResponse;
  musicAlbum: MusicAlbumResponse;
  person: PersonResponse;
  role: RoleResponse;
  studio: StudioResponse;
  tag: TagResponse;
  tvEpisode: TvEpisodeResponse;
  tvEpisodeStaff: TvEpisodeStaffResponse;
  tvSeason: TvSeasonResponse;
  tvSeasonStaff: TvSeasonStaffResponse;
  tvSeries: TvSeriesResponse;
  tvSeriesStaff: TvSeriesStaffResponse;
  user: UserResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
  collection(idOrName: "collection"): RecordService<CollectionResponse>;
  collection(idOrName: "country"): RecordService<CountryResponse>;
  collection(idOrName: "genre"): RecordService<GenreResponse>;
  collection(idOrName: "language"): RecordService<LanguageResponse>;
  collection(idOrName: "movie"): RecordService<MovieResponse>;
  collection(idOrName: "movieStaff"): RecordService<MovieStaffResponse>;
  collection(idOrName: "musicAlbum"): RecordService<MusicAlbumResponse>;
  collection(idOrName: "person"): RecordService<PersonResponse>;
  collection(idOrName: "role"): RecordService<RoleResponse>;
  collection(idOrName: "studio"): RecordService<StudioResponse>;
  collection(idOrName: "tag"): RecordService<TagResponse>;
  collection(idOrName: "tvEpisode"): RecordService<TvEpisodeResponse>;
  collection(idOrName: "tvEpisodeStaff"): RecordService<TvEpisodeStaffResponse>;
  collection(idOrName: "tvSeason"): RecordService<TvSeasonResponse>;
  collection(idOrName: "tvSeasonStaff"): RecordService<TvSeasonStaffResponse>;
  collection(idOrName: "tvSeries"): RecordService<TvSeriesResponse>;
  collection(idOrName: "tvSeriesStaff"): RecordService<TvSeriesStaffResponse>;
  collection(idOrName: "user"): RecordService<UserResponse>;
};
