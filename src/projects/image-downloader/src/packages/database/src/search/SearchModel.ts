import { prop, getModelForClass } from '@typegoose/typegoose';

import { OrderBy, OrderDirection, RangeType } from '@zougui/image-downloader.furaffinity';
import type { DocumentType } from '@zougui/common.mongo-core';
import type { WeakEnum } from '@zougui/common.type-utils';

import { enumProp, timestamps, WithTimestamps } from '../core';

export class SearchOrigin {
  @prop({ required: true, trim: true })
  name!: string;

  @prop({ required: true, trim: true })
  url!: string;
}

export enum SearchStatus {
  Idle = 'idle',
  Downloading = 'downloading',
  Success = 'success',
  Error = 'error',
}

export class SearchOptions {
  @enumProp({ enum: OrderBy })
  orderBy?: WeakEnum<OrderBy> | undefined;

  @enumProp({ enum: OrderDirection })
  orderDirection?: WeakEnum<OrderDirection> | undefined;

  @prop({ type: Number, default: 1 })
  page?: number | undefined;

  @enumProp({ enum: RangeType })
  range?: WeakEnum<RangeType> | undefined;

  @prop({ type: Date })
  rangeFrom?: Date | undefined;

  @prop({ type: Date })
  rangeTo?: Date | undefined;
}

export interface Search extends WithTimestamps {}

@timestamps()
export class Search {
  @prop({ required: true, type: () => SearchOrigin, _id: false })
  origin!: SearchOrigin;

  @prop({ required: true })
  query!: string;

  @enumProp({ enum: SearchStatus, default: SearchStatus.Idle })
  status!: WeakEnum<SearchStatus>;

  @prop({ default: {}, _id: false, type: () => SearchOptions })
  options!: SearchOptions;

  /**
   * can be an ID or a URL
   */
  @prop({ type: [String], default: [] })
  failedToDownload!: string[];
}

export const SearchModel = getModelForClass(Search);

export type SearchDocument = DocumentType<Search>;
