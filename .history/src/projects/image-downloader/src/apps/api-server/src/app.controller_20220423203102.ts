import path from 'node:path';
import crypto from 'node:crypto';

import {
  Controller,
  Get,
  Post,
  Body,
  Options,
  Res,
  UsePipes,
} from '@nestjs/common';
import type { Response } from 'express';
import * as yup from 'yup';
import fs from 'fs-extra';
import * as uuid from 'uuid';
import mime from 'mime-types';
import leven from 'fast-levenshtein';

import {
  connect,
  unprocessedMediaQueries,
  UnprocessedMediaDocument,
  searchQueries,
  UnprocessedMediaModel,
  MediaModel,
  OptimizedMedia,
} from '@zougui/image-downloader.database';
import env from '@zougui/common.env/node';
import { getFileSize, downloadFile, getFileHashAndType } from '@zougui/common.fs-utils';
import { SearchResult } from '@zougui/image-downloader.furaffinity';
import {
  createUnprocessedMedia,
  downloadSubmissions,
  createOrAddMedia,
  optimizeImage,
} from '@zougui/image-downloader.media';
import { promiseAll } from '@zougui/common.promise-utils';
import { getErrorMessage } from '@zougui/common.error-utils';

import { AppService } from './app.service';
import { YupValidationPipe } from './YupValidationPipe';
import { furaffinityQuerySearch } from './furaffinityQuerySearch';
import { allowCors } from './allowCors';

const authorSchema = yup.object({
  name: yup.string().required(),
  profileUrl: yup.string().required(),
});

const descriptionNodeSchema = yup.object({
  type: yup.string().oneOf(['text', 'link', 'unknown']).required(),
  text: yup.string().default(''),
});

const mediaCreationBodySchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  // TODO strict schema for description nodes
  descriptionNodes: yup.array().of(descriptionNodeSchema).required(),
  url: yup.string().url().required(),
  downloadUrl: yup.string().url().required(),
  species: yup.array().of(yup.string()).required(),
  genders: yup.array().of(yup.string()).required(),
  tags: yup.array().of(yup.string()).required(),
  author: authorSchema.required(),
  publishedAt: yup.date().required(),
  rating: yup.string().oneOf(['SFW', 'NSFW']).required(),
});

@Controller('/api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/media')
  @UsePipes(new YupValidationPipe(mediaCreationBodySchema as any))
  async createMedia(@Body() body: any, @Res() res: Response) {
    allowCors(res);
    await saveImage(body);

    return { ok: true };
  }

  @Options('/media')
  async optionsMedia() {
    return { ok: true };
  }
}

const saveImage = async (unprocessedMediaDoc: UnprocessedMediaDocument) => {
  await unprocessedMediaQueries.startDownloading(unprocessedMediaDoc._id);

  let metadata: {
    fileName: string;
    hashes: string[];
    contentType: string;
    width: number;
    height: number;
    extension: string;
    type: string;
    size: number;
    optimizedMedias: OptimizedMedia[];
  };

  try {
    console.log('downloading submission...');
    console.time('downloaded submission');
    const filePath = await downloadImage(unprocessedMediaDoc).finally(() => {
      console.timeEnd('downloaded submission');
    });

    const { result, fileSize, fileStat, optimizedImages } = await promiseAll({
      result: getFileHashAndType(filePath, {
        failsafePath: unprocessedMediaDoc.downloadUrl,
      }),
      optimizedImages: optimizeImage(filePath),
      fileSize: getFileSize(filePath),
      fileStat: fs.stat(filePath),
    });

    const extension = path.extname(unprocessedMediaDoc.originalFileName) || mime.extension(result.contentType) || 'unknown';

    const type = result.contentType.split('/')[0];

    const optimized = optimizedImages.map(images => {
      const optimizedMedias = Object.values(images).map(image => {
        if (typeof image !== 'object') {
          return;
        }

        const transformations = ['resize'];
        const isOriginalFormat = image.format === 'original';

        if (!isOriginalFormat) {
          transformations.push('reformat');
        }

        const fileName = path.basename(image.file);
        const contentType = isOriginalFormat
          ? result.contentType
         : mime.lookup(image.format);

        if(!contentType) {
          return;
        }

        return {
          extension,
          fileName,
          size: image.output.size,
          width: image.output.width,
          height: image.output.height,
          transformations,
          label: image.label,
          contentType,
          type: contentType.split('/')[0],
        };
      }).filter(Boolean) as OptimizedMedia[];

      return optimizedMedias;
    }).flat();

    metadata = {
      fileName: path.basename(filePath),
      hashes: result.hashes,
      contentType: result.contentType,
      width: fileSize.width,
      height: fileSize.height,
      extension,
      size: fileStat.size,
      type,
      optimizedMedias: optimized,
    };
  } catch (error) {
    console.log('image error', getErrorMessage(error));
    await unprocessedMediaQueries.processingError(unprocessedMediaDoc._id);
    return;
  }

  await createOrAddMedia(unprocessedMediaDoc, metadata as any);
  await unprocessedMediaQueries.deleteById(unprocessedMediaDoc._id);
}

const downloadImage = async (unprocessedMedia: UnprocessedMediaDocument): Promise<string> => {
  const file = path.join(env.APP_WORKSPACE, 'downloads', uuid.v4());
  await fs.ensureDir(path.dirname(file));
  await downloadFile(unprocessedMedia.downloadUrl, { file });

  return file;
}

(async () => {
  return;
  await connect();
  await UnprocessedMediaModel.deleteMany();
  await MediaModel.deleteMany();
  const jsonFile = '/mnt/Dev/Code/javascript/zougui/src/projects/image-downloader/src/apps/api-server/result.json';
  const cacheFile = '/mnt/Dev/Code/javascript/zougui/src/projects/image-downloader/src/apps/api-server/cache.json';

  const [searchMaybe] = await searchQueries.findMany({}, { options: 1 });

  const search = searchMaybe || await searchQueries.create({
    options: {
      page: 1,
      orderBy: 'relevancy',
      range: 'all',
    },
    origin: {
      name: 'furaffinity',
      url: 'https://www.furaffinity.net/search',
    },
    query: 'dragon',
  });

  const hasCache = await fs.pathExists(cacheFile);
  let submissions: SearchResult;

  if (hasCache) {
    submissions = await fs.readJson(cacheFile);
  } else {
    submissions = await downloadSubmissions(search);
    await fs.writeJson(cacheFile, submissions, { spaces: 2 });
  }

  const subsDocs = await createUnprocessedMedia(submissions.downloaded);

  console.log('Submissions downloaded:', submissions.downloaded.length);
  if (submissions.errored.length) {
    const erroredSubmissionList = submissions.errored.map(sub => `${sub.url}: ${sub.errorMessage}`);
    console.log('Failed to download:', '\n  ' + erroredSubmissionList.join('\n  '));
  }

  for (const submission of subsDocs) {
    console.group(`Submission "${submission.url}"`);
    await saveImage(submission);
    console.groupEnd();
    console.log();
  }

  console.log('All submissions saved');

  await fs.writeJson(jsonFile, submissions, { spaces: 2 });
  console.log('written');
})();
