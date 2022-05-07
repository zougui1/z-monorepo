import type { Types } from 'mongoose';

import {
  Search,
  SearchModel,
  SearchDocument,
  SearchStatus,
  SearchOptions,
} from './SearchModel';
import type { OmitTimestamps } from '../core';

class SearchQueries {
  create = async (search: OmitTimestamps<Omit<Search, 'failedToDownload' | 'status'>>): Promise<SearchDocument> => {
    return await SearchModel.create(search);
  }

  startDownloading = async ({ id }: StartDownloadingFilter, update: StartDownloadingUpdate | undefined = {}): Promise<void> => {
    update = { ...update };

    // remove the range dates if the range mode is updated to non-manual
    if (update.range && update.range !== 'manual') {
      update.rangeFrom = undefined;
      update.rangeTo = undefined;
    }

    await SearchModel.updateOne(
      { _id: id },
      { ...update, status: SearchStatus.Downloading },
    );
  }

  downloadedPage = async ({ id }: DownloadedPageFilter, update?: DownloadedPageUpdate | undefined): Promise<void> => {
    await SearchModel.updateOne(
      { _id: id },
      {
        status: SearchStatus.Idle,
        $inc: {
          'options.page': 1,
        },
        $addToSet: {
          failedToDownload: {
            $each: update?.failedToDownload || [],
          },
        },
      },
    );
  }

  findMany = async (filter?: {} | undefined, projection?: Partial<Record<keyof Search, 1 | 0>> | undefined): Promise<SearchDocument[]> => {
    return await SearchModel.find(filter || {}, {
      _id: 1,
      ...projection,
    });
  }
}

export const searchQueries = new SearchQueries();

export interface StartDownloadingFilter {
  id: Types.ObjectId;
}

export interface StartDownloadingUpdate extends SearchOptions {

}

export interface DownloadedPageFilter {
  id: Types.ObjectId;
}

export interface DownloadedPageUpdate {
  failedToDownload?: string[] | undefined;
}
