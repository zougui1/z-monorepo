import path from 'node:path';

import {
  Controller,
  Get,
  Post,
  Body,
  Options,
  Res,
  UsePipes,
} from '@nestjs/common';
import mongoose from 'mongoose';
import type { Response } from 'express';
import * as yup from 'yup';
import fs from 'fs-extra';
import * as uuid from 'uuid';
import leven from 'fast-levenshtein';
import mime from 'mime-types';

import {
  connect,
  unprocessedMediaQueries,
  UnprocessedMediaDocument,
  mediaQueries,
  searchQueries,
  UnprocessedMediaModel,
} from '@zougui/image-downloader.database';
import env from '@zougui/common.env/node';
import {
  hashFile,
  getFileSize,
  makeMultiImagePreviews,
  getFileType,
  downloadFile,
} from '@zougui/common.fs-utils';
import {
  downloadPage,
  SearchResult,
} from '@zougui/image-downloader.furaffinity';
import {
  createUnprocessedMedia,
  downloadSubmissions,
} from '@zougui/image-downloader.media';

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

const optimizeImage = async (filePath: string) => {
  const dir = path.join(env.APP_WORKSPACE, 'downloads/variants');

  await makeMultiImagePreviews(filePath, {
    destDir: dir,
    widths: [200, '50%', '70%'],
    formats: ['original', 'avif', 'webp'],
  });

  process.exit(0);
}

const saveImage = async (unprocessedMediaDoc: UnprocessedMediaDocument) => {
  await connect();

  console.log('downloading submission...');
  console.time('downloaded submission');
  const filePath = await downloadImage(unprocessedMediaDoc);
  console.timeEnd('downloaded submission');

  let metadata: {
    hashes: string[];
    contentType: string;
    width?: number | undefined;
    height?: number | undefined;
    extension: string;
    type: string;
    size: number;
  };

  try {
    const result = await getImageData({
      filePath,
      backupPath: unprocessedMediaDoc.downloadUrl,
    });

    await optimizeImage(filePath);

    const { width, height } = await getFileSize(filePath);

    const extension = path.extname(unprocessedMediaDoc.originalFileName) || mime.extension(result.contentType) || 'unknown';
    const fileStat = await fs.stat(filePath);

    const type = result.contentType.split('/')[0];

    metadata = {
      hashes: result.hashes,
      contentType: result.contentType,
      width,
      height,
      extension,
      size: fileStat.size,
      type,
    };
  } catch (error) {
    console.log('image error', error);
    return;
  }

  const fileData = {
    ...metadata,
    fileName: path.basename(filePath),
  };

  try {
    await mediaQueries.create(unprocessedMediaDoc, fileData);
  } catch (error) {
    // duplicate key error
    if (
      !(error instanceof mongoose.mongo.MongoServerError) ||
      error.code !== 11000
    ) {
      throw error;
    }

    mediaQueries.addPost(unprocessedMediaDoc, fileData);
  }

  await unprocessedMediaQueries.deleteById(unprocessedMediaDoc._id);
}

const downloadImage = async (unprocessedMedia: UnprocessedMediaDocument) => {
  const file = path.join(env.APP_WORKSPACE, 'downloads', uuid.v4());
  await fs.ensureDir(path.dirname(file));
  await downloadFile(unprocessedMedia.downloadUrl, { file });
};

const getImageData = async ({ filePath, backupPath }: { filePath: string, backupPath: string }) => {
  const hashes = await hashFile(filePath);
  const contentType = await getFileType(filePath, { failsafePath: backupPath });

  if (!contentType) {
    throw new Error('No file content-type found');
  }

  return {
    hashes,
    contentType,
  };
};

/*(async () => {
  return;
  const firstImage = '/mnt/Manjaro_Data/zougui/workspace/api-server/downloads/gfhdbthgdf';
  const secondImage = '/mnt/Manjaro_Data/zougui/workspace/api-server/downloads/c427d2d4-5a81-4dab-a4a2-5d5214123084';
  const firstImageData = await getImageData(firstImage);
  const secondImageData = await getImageData(secondImage);

  console.log('hash 1:', firstImageData.hash);
  console.log('hash 2:', secondImageData.hash);
  console.log('distance', leven.get(firstImageData.hash, secondImageData.hash));
})();*/

(async () => {
  await connect();
  await UnprocessedMediaModel.deleteMany();
  const jsonFile = '/mnt/Dev/Code/javascript/zougui/src/projects/image-downloader/src/apps/api-server/result.json';
  const cacheFile = '/mnt/Dev/Code/javascript/zougui/src/projects/image-downloader/src/apps/api-server/cache.json';

  /*const img = await fs.readFile('/mnt/Manjaro_Data/zougui/workspace/api-server/downloads/46254c88-375c-46f7-96ee-486bb1984aa4', 'utf8');
  console.log(img)
  const mimeType = await getImageData({
    filePath: '/mnt/Manjaro_Data/zougui/workspace/api-server/downloads/56158e81-2bff-4ebc-b618-56a2407afc53',
    backupPath: 'https://d.furaffinity.net/art/typhin/stories/1650386354/1650386354.typhin_princess_part_13.txt',
  });
  console.log(mimeType)

  return;*/
  const [searchMaybe] = await searchQueries.findMany({}, { options: 1 });

  const search = searchMaybe || await searchQueries.create({
    options: {
      page: 1,
      orderBy: 'date',
    },
    origin: {
      name: 'furaffinity',
      url: 'https://www.furaffinity.net/search',
    },
    query: furaffinityQuerySearch,
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

  //return;
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
