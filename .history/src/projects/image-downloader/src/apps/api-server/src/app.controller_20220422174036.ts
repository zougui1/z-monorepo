import path from 'node:path';
import { URL } from 'node:url';

import {
  Controller,
  Get,
  Post,
  Body,
  Options,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as yup from 'yup';
import axios from 'axios';
import fs from 'fs-extra';
import * as uuid from 'uuid';
import leven from 'fast-levenshtein';
import fileType from 'file-type';
import mime from 'mime-types';

import {
  connect,
  unprocessedMediaQueries,
  UnprocessedMediaDocument,
  mediaQueries,
  searchQueries,
  SearchDocument,
} from '@zougui/image-downloader.database';
import env from '@zougui/common.env/node';
import { streamToFile, multiOptimizeImage, hashFile, getFileSize } from '@zougui/common.fs-utils';
import {
  downloadPage,
  Submission,
  SearchResult,
  search,
  downloadSubmissions as faDownloadSubmissions,
} from '@zougui/image-downloader.furaffinity';
import { Percent } from '@zougui/common.type-utils';

import { AppService } from './app.service';
import { YupValidationPipe } from './YupValidationPipe';
import { furaffinityQuerySearch } from './furaffinityQuerySearch';

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
  async createMedia(
    @Req() req: Request,
    @Body() body: any,
    @Res() res: Response,
  ) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'HEAD, GET, POST, PUT, PATCH, DELETE',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, Accept, Authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    await saveImage(body);

    return { ok: true };
  }

  @Options('/media')
  async optionsMedia() {
    return { ok: true };
  }
}

const createUnprocessedMediaDoc = async (submission: Submission | Submission[]) => {
  const submissions = Array.isArray(submission) ? submission : [submission];

  const formattedSubmissions = submissions.map(submission => {
    const originUrlObject = new URL(submission.author.url);

    return {
      ...submission,
      species: submission.species,
      categories: submission.categories,
      genders: submission.genders,
      originalFileName: submission.fileName,
      author: {
        id: submission.author.id,
        name: submission.author.name,
        origin: {
          name: originUrlObject.hostname,
          url: originUrlObject.origin,
          profileUrl: submission.author.url,
          avatar: submission.author.avatar,
        },
      },
      status: 'downloading' as const,
    };
  });

  const unprocessedMediaDoc = await unprocessedMediaQueries.createMany(formattedSubmissions);

  return unprocessedMediaDoc
}

const makePreviews = async (filePath: string, destDir: string, width: number | Percent) => {
  const getDestFile = () => path.join(destDir, uuid.v4());

  await multiOptimizeImage(filePath, {
    original: {
      width,
      destFile: getDestFile(),
    },
    avif: {
      width,
      destFile: getDestFile(),
    },
    webp: {
      width,
      destFile: getDestFile(),
    },
    streamToTempFile: true,
  });
}

const optimizeImage = async (filePath: string) => {
  const dir = '/mnt/Manjaro_Data/zougui/workspace/api-server/downloads/variants';

  await fs.ensureDir(dir);
  await Promise.all([
    makePreviews(filePath, dir, 200),
    makePreviews(filePath, dir, '50%'),
    makePreviews(filePath, dir, '70%'),
  ]);

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
  let stream: fs.WriteStream | undefined;

  try {
    const writeStream = (stream = await streamToFile(file));
    const waitStream = new Promise((resolve, reject) => {
      writeStream.once('finish', resolve);
      writeStream.once('error', reject);
    });

    const response = await axios.get(encodeURI(unprocessedMedia.downloadUrl), {
      responseType: 'stream',
    });

    response.data.pipe(writeStream);
    await waitStream;
  } catch (error) {
    if (fs.pathExistsSync(file)) {
      await fs.unlink(file);
    }

    throw error;
  } finally {
    stream?.removeAllListeners();
  }

  return file;
};

const getImageData = async ({ filePath, backupPath }: { filePath: string, backupPath: string }) => {
  const hashes = await hashFile(filePath);

  const binaryContentType = await fileType.fromFile(filePath);
  const plainContentType = mime.lookup(path.basename(filePath)) || mime.lookup(path.basename(backupPath));
  const contentType = binaryContentType?.mime || plainContentType;

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

const downloadSubmissions = async ({ cacheFile, search: searchDoc }: { cacheFile: string, search: SearchDocument }) => {
  console.log('downloading submissions...');
  console.time('submissions downloaded');
  await searchQueries.startDownloading({ id: searchDoc._id });
  const submissions = await search(furaffinityQuerySearch, {
    page: searchDoc.options.page || 1,
    orderBy: 'date',
  });
  console.log(submissions.map(s => s.url))

  const existingSubmissions = await Promise.all(submissions.map(async submission => {
    const unprocessedMediaDoc = await unprocessedMediaQueries.findByUrl(submission.url);

    if (unprocessedMediaDoc) {
      return [unprocessedMediaDoc.url];
    }

    const mediaDoc = await mediaQueries.findByUrl(submission.url);

    if (mediaDoc) {
      return mediaDoc.posts.map(post => post.urls).flat();
    }

    return [];
  }));
  const existingSubmissionsFlat = existingSubmissions.flat();
  console.log(existingSubmissionsFlat)

  const newSubmissions = submissions.filter(submission => {
    return !existingSubmissionsFlat.includes(submission.url);
  });

  const downloadResult = await faDownloadSubmissions(newSubmissions);

  await searchQueries.downloadedPage(
    { id: searchDoc._id },
    { failedToDownload: downloadResult.errored.map(err => err.url) },
  );
  console.timeEnd('submissions downloaded');

  await fs.writeJson(cacheFile, downloadResult, { spaces: 2 });

  return downloadResult;
}

(async () => {
  await connect();
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

  const submissions = hasCache
    ? await fs.readJson(cacheFile) as SearchResult
    : await downloadSubmissions({ cacheFile, search });

  const subsDocs = await createUnprocessedMediaDoc(submissions.downloaded);

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
