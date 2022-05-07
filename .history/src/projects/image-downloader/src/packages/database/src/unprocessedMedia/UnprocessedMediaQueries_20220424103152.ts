import type { Types, UpdateWithAggregationPipeline, UpdateQuery } from 'mongoose';
import type { DocumentType } from '@typegoose/typegoose';
import type { BeAnObject } from '@typegoose/typegoose/lib/types';

import {
  UnprocessedMediaModel,
  UnprocessedMediaDocument,
  UnprocessedMediaStatus,
  MediaStatusReport,
} from './UnprocessedMediaModel';
import { createMediaRefs, UnprocessedMediaCreationOutput } from './createMediaRefs';
import type { UnprocessedMediaCreation } from './types';

class UnprocessedMediaQueries {
  create = async (media: UnprocessedMediaCreation): Promise<UnprocessedMediaDocument> => {
    const mediaWithRefs = await createMediaRefs(media);
    console.log('description')

    return await UnprocessedMediaModel.create(mediaWithRefs);
  }

  createMany = async (medias: UnprocessedMediaCreation[]): Promise<UnprocessedMediaDocument[]> =>  {
    const mediasWithRefs: UnprocessedMediaCreationOutput[] = [];

    for (const media of medias) {
      mediasWithRefs.push(await createMediaRefs(media));
    }

    return await UnprocessedMediaModel.create(mediasWithRefs);
  }

  deleteById = async (id: Types.ObjectId): Promise<void> => {
    await UnprocessedMediaModel.findByIdAndDelete(id);
  }

  findByUrl = async (url: string): Promise<UnprocessedMediaDocument | null> => {
    return await UnprocessedMediaModel.findOne({ url });
  }

  startDownloading = async (id: Types.ObjectId): Promise<void> => {
    await this.updateStatusById(id, UnprocessedMediaStatus.downloading);
  }

  processingError = async (id: Types.ObjectId, error?: Error | undefined): Promise<void> => {
    const errorObject = error && {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
    await this.updateStatusById(id, UnprocessedMediaStatus.error, { error: errorObject });
  }

  multipleDuplicatesFound = async (id: Types.ObjectId, duplicateIds: Types.ObjectId[]): Promise<void> => {
    await this.updateStatusById(id, UnprocessedMediaStatus.multipleDuplicates, { duplicateIds });
  }

  //#region private
  updateStatusById = async (
    id: Types.ObjectId,
    status: UnprocessedMediaStatus,
    statusReport?: UpdateWithAggregationPipeline | UpdateQuery<DocumentType<MediaStatusReport, BeAnObject>> | undefined,
  ): Promise<void> => {
    const updateQuery: UpdateWithAggregationPipeline | UpdateQuery<DocumentType<MediaStatusReport, BeAnObject>> = { status };

    if (statusReport) {
      updateQuery.statusReport = statusReport;
    }

    await UnprocessedMediaModel.updateOne({ _id: id }, updateQuery);
  }
  //#endregion
}

export const unprocessedMediaQueries = new UnprocessedMediaQueries();
