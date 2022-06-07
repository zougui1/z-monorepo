import type { Types } from 'mongoose';

import {
  Search,
  SearchObject,
  SearchModel,
  SearchDocument,
  SearchStatus,
} from './SearchModel';
import type { OmitTimestamps } from '../core';

class SearchQueries {
  create = async (search: OmitTimestamps<Omit<Search, 'failedToDownload' | 'status'>>): Promise<SearchDocument> => {
    return await SearchModel.create(search);
  }

  startNewCursor = async ({ id }: { id: Types.ObjectId }): Promise<void> => {
    const search = await SearchModel.findById(id);

    // TODO log
    if (!search) {
      console.log('no search')
      return;
    }

    search.cursors.unshift({
      date: new Date(),
      currentPage: 1,
      pageCount: 0,
    });

    await search.save();
  }

  startDownloading = async ({ id }: StartDownloadingFilter): Promise<void> => {
    await SearchModel.updateOne(
      { _id: id },
      { status: SearchStatus.Downloading },
    );
  }

  downloadedPage = async ({ id, date }: DownloadedPageFilter, update?: DownloadedPageUpdate | undefined): Promise<void> => {
    const search = await SearchModel.findOne({ _id: id });

    // TODO log
    if (!search) {
      console.log('no search')
      return;
    }

    search.status = SearchStatus.Idle;
    console.log()
    console.log('update', update)
    console.log()

    if (update?.failedToDownload?.length) {
      search.failedToDownload.push(...update.failedToDownload);
    }

    const cursor = search.cursors.find(cursor => cursor.date.valueOf() === date.valueOf());

    // TODO log
    if (!cursor) {
      console.log('no cursor')
      await search.save();
      return;
    }

    const cursorIndex = search.cursors.findIndex(cursor_ => cursor_ === cursor);

    // remove the next cursor if the current cursor intersects with it
    if (update?.intersectsWithNextCursor) {
      const nextCursorIndex = cursorIndex + 1;
      const nextCursor = search.cursors[nextCursorIndex];

      if (nextCursor) {
        // remove current cursor
        search.cursors = search.cursors.filter((c, index) => index !== cursorIndex);
      }

      // we need to update the current cursor if there is no other one
      if (!search.cursors[nextCursorIndex]) {
        search.cursors = search.cursors.map((cursor_, index) => {
          if (index !== cursorIndex) {
            return cursor_;
          }

          cursor_.currentPage = cursor.currentPage + 1;
          cursor_.pageCount = cursor.pageCount + 1;
          return cursor_;
        });
      }

      // else just update the date if one is provided
    } else {
      search.cursors = search.cursors.map((cursor_, index) => {
        if (index !== cursorIndex) {
          return cursor_;
        }

        if (update?.date) {
          cursor.date = update.date;
        }

        cursor_.currentPage = update?.currentPage ?? cursor.currentPage + 1;
        cursor_.pageCount = update?.pageCount ?? cursor.pageCount + 1;
        return cursor_;
      });
    }

    await search.save();
  }

  findMany = async (filter?: {} | undefined, projection?: Partial<Record<keyof Search, 1 | 0>> | undefined): Promise<SearchObject[]> => {
    const searches = await SearchModel.find(filter || {}, {
      _id: 1,
      ...projection,
    });

    return searches.map(search => search.toObject());
  }
}

export const searchQueries = new SearchQueries();

export interface StartDownloadingFilter {
  id: Types.ObjectId;
}

export interface DownloadedPageFilter {
  id: Types.ObjectId;
  date: Date;
}

export interface DownloadedPageUpdate {
  failedToDownload?: string[] | undefined;
  date?: Date | undefined;
  currentPage?: number | undefined;
  pageCount?: number | undefined;
  intersectsWithNextCursor?: boolean | undefined;
}
