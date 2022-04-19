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
import imgHash from 'imghash';
import leven from 'fast-levenshtein';
import fileType from 'file-type';

import {
  connect,
  unprocessedMediaQueries,
  UnprocessedMediaDocument,
  mediaQueries,
} from '@zougui/image-downloader.database';
import env from '@zougui/common.env/node';
import { streamToFile } from '@zougui/common.fs-utils';
import { downloadPage, Submission, SearchResult } from '@zougui/image-downloader.furaffinity';

import { AppService } from './app.service';
import { YupValidationPipe } from './YupValidationPipe';

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

const saveImage = async (submission: Submission) => {
  await connect();

  const originUrlObject = new URL(submission.author.url);

  const unprocessedMediaDoc = await unprocessedMediaQueries.create({
    ...submission,
    species: submission.species,
    categories: submission.categories,
    genders: submission.genders,
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
    status: 'downloading',
  });

  console.log('downloading submission...');
  console.time('downloaded submission');
  const filePath = await downloadImage(unprocessedMediaDoc);
  console.timeEnd('downloaded submission');

  const { hash, mimeType } = await getImageData(filePath);
  const fileData = {
    fileName: path.basename(filePath),
    mimeType,
    hash,
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

    mediaQueries.addVariant(unprocessedMediaDoc, fileData);
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

const getImageData = async (filePath: string) => {
  const mimeType = await fileType.fromFile(filePath);
  const hash = await imgHash.hash(filePath, 16);

  return {
    mimeType: mimeType.mime,
    hash,
  };
};

(async () => {
  return;
  const firstImage = '/mnt/Manjaro_Data/zougui/workspace/api-server/downloads/gfhdbthgdf';
  const secondImage = '/mnt/Manjaro_Data/zougui/workspace/api-server/downloads/c427d2d4-5a81-4dab-a4a2-5d5214123084';
  const firstImageData = await getImageData(firstImage);
  const secondImageData = await getImageData(secondImage);

  console.log('hash 1:', firstImageData.hash);
  console.log('hash 2:', secondImageData.hash);
  console.log('distance', leven.get(firstImageData.hash, secondImageData.hash));
})();

const includedTags = [
  'dragon',
  'dragons',
  'wolf',
  'wolves',
  'dog',
  'raptor',
  'bird',
  'avian',
  'gryphon',
  'gryphons',
  'monster',
  'dragons',
  'tentacle',
  'tentacles',
];

const exlcudedTags = [
  'fart',
  'scat',
  'diaper',
  'dbz',
  'dragonballz',
  'dragon_ball_z',
  'taur',
  '(dragon ball z)',
].map((tag) => `!${tag}`);

const excludedKeywords = [
  'bodybuilder',
].map((tag) => `!${tag}`);

const includedTagsStr = includedTags.join(' | ');
const exlcudedTagsStr = exlcudedTags.join(' ');
const excludedKeywordsStr = `@keywords ${excludedKeywords.join(' ')}`;
const searchStr = `${includedTagsStr} ${exlcudedTagsStr} ${excludedKeywordsStr}`;
console.log({ searchStr });

const downloadSubmissions = async ({ cacheFile }: { cacheFile: string }) => {
  console.log('downloading submissions...');
  console.time('submissions downloaded');
  const submissions = await downloadPage(searchStr, {
    page: 1,
    orderBy: 'date',
  });
  console.timeEnd('submissions downloaded');

  //await fs.writeJson(cacheFile, submissions, { spaces: 2 });

  return submissions;
}

(async () => {
  const jsonFile = '/mnt/Dev/Code/javascript/zougui/src/projects/image-downloader/src/apps/api-server/result.json';
  const cacheFile = '/mnt/Dev/Code/javascript/zougui/src/projects/image-downloader/src/apps/api-server/cache.json';

  const hasCache = await fs.pathExists(cacheFile);

  const submissions = hasCache
    ? await fs.readJson(cacheFile) as SearchResult
    : await downloadSubmissions({ cacheFile });

  console.log('Submissions downloaded:', submissions.downloaded.length);
  if (submissions.errored.length) {
    const erroredSubmissionList = submissions.errored.map(sub => `${sub.url}: ${sub.errorMessage}`);
    console.log('Failed to download:', '\n  ' + erroredSubmissionList.join('\n  '));
  }

  await new Promise(r => setTimeout(r, 5000));
  if (submissions.retry) {
    const retriedSubmissions = await submissions.retry();

    console.log('Submissions downloaded:', retriedSubmissions.downloaded.length);
    if (retriedSubmissions.errored.length) {
      const erroredSubmissionList = retriedSubmissions.errored.map(sub => `${sub.url}: ${sub.errorMessage}`);
      console.log('Failed to download:', '\n  ' + erroredSubmissionList.join('\n  '));
    }
  }

  return;
  for (const submission of submissions.downloaded) {
    console.group(`Submission "${submission.url}"`);
    await saveImage(submission);
    console.groupEnd();
    console.log();
  }

  console.log('All submissions saved');

  await fs.writeJson(jsonFile, submissions, { spaces: 2 });
  console.log('written');
})();
