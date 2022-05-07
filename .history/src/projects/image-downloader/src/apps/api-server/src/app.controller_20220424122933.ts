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
import sharp from 'sharp';
import { decode, GIF, Frame } from 'imagescript';
import imgHash from 'imghash';
import leven from 'fast-levenshtein';

import {
  connect,
  searchQueries,
  UnprocessedMediaModel,
  MediaModel,
} from '@zougui/image-downloader.database';
import { SearchResult } from '@zougui/image-downloader.furaffinity';
import {
  createUnprocessedMedia,
  downloadSubmissions,
  saveMedia,
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
    await saveMedia(body);

    return { ok: true };
  }

  @Options('/media')
  async optionsMedia() {
    return { ok: true };
  }
}

(async () => {
  const file = '/mnt/Manjaro_Data/zougui/Artworks/Dragons/NSFW/4a5accf74b0919f95ec3c48ddef31239.gif';
  const gifHashFile = '/mnt/Dev/Code/javascript/zougui/src/projects/image-downloader/src/apps/api-server/result.json';
  //const file = '/mnt/Manjaro_Data/zougui/Artworks/Dragons/NSFW/gifs/ZtreN7Pq.gif'

  const gifData = await fs.readFile(file);
  const gif = await decode(gifData) as GIF;

  console.log('images:', gif.length);
  console.log('first frame', gif[0]);

  const hashes: string[] = [];

  for (const frame of gif) {
    const hash = imgHash.hashRaw({
      width: frame.width,
      height: frame.height,
      data: frame.bitmap,
    }, 16);
    hashes.push(hash);
    //frame.encodeJPEG()
    //console.log('frame', frame.width, frame.height, frame)
  }

  const distances = hashes.map((hash, index) => {
    const frame = {
      hash,
      index,
    };
    const otherHashes = hashes
      .map((hash, index) => ({ hash, index }))
      .filter(otherFrame => frame.index !== otherFrame.index);

    return otherHashes.map(otherFrame => {
      return {
        matchedFrames: [frame, otherFrame],
        distance: leven.get(hash, otherFrame.hash)
      };
    });
  });

  await fs.writeJson(gifHashFile, distances, { spaces: 2 });

  const metadata = await sharp(file).metadata();
  console.log(metadata)
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
    await saveMedia(submission);
    console.groupEnd();
    console.log();
  }

  console.log('All submissions saved');

  await fs.writeJson(jsonFile, submissions, { spaces: 2 });
  console.log('written');
})();
