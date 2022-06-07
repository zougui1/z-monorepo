import { prop, getModelForClass } from '@typegoose/typegoose';
import type { Types } from 'mongoose';

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

export class SearchCursor {
  @prop({ type: Date, required: true })
  date!: Date;

  @prop({ default: 1 })
  currentPage!: number;

  @prop({ default: 1 })
  pageCount!: number;
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

  /**
   * can be an ID or a URL
   */
  @prop({ type: [String], default: [] })
  failedToDownload!: string[];

  @prop({ type: [SearchCursor], default: [], _id: false })
  cursors!: SearchCursor[];
}

export const SearchModel = getModelForClass(Search);
export type SearchObject = Search & { _id: Types.ObjectId };
export type SearchDocument = DocumentType<Search>;
export * from '@typegoose/typegoose/lib/types';
