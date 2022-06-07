import path from 'node:path';

import {
  Controller,
  Get,
  Post,
  Body,
  Options,
  Res,
  UsePipes,
  HttpStatus,
  Param,
} from '@nestjs/common';
import type { Response } from 'express';
import * as yup from 'yup';
import fs from 'fs-extra';

import { mediaQueries, UnprocessedMediaModel, MediaModel, SearchModel } from '@zougui/image-downloader.database';
import { saveMedia, downloadFuraffinity } from '@zougui/image-downloader.media';
import config from '@zougui/common.config/node';

import { YupValidationPipe } from './YupValidationPipe';
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
  constructor() {}

  @Get('/medias')
  async getMedias(@Res() res: Response) {
    allowCors(res);

    const medias = await mediaQueries.findMany();
    console.log('medias:', medias.length)

    res.status(HttpStatus.OK).json(medias);
  }

  @Get('/medias/file/:fileName')
  async getFile(@Res() res: Response, @Param('fileName') fileName: string) {
    allowCors(res);

    const imageFile = path.join(config.media.fs.mediaDir, fileName);
    const imageVariantFile = path.join(config.media.fs.mediaVariantsDir, fileName);

    if (await fs.pathExists(imageFile)) {
      const stream = fs.createReadStream(imageFile);
      stream.pipe(res);
      return;
    }

    if (await fs.pathExists(imageVariantFile)) {
      const stream = fs.createReadStream(imageVariantFile);
      stream.pipe(res);
      return;
    }

    throw new Error('file not found');
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
  /*await SearchModel.deleteMany();
  await UnprocessedMediaModel.deleteMany();
  await MediaModel.deleteMany();*/
  //await downloadFuraffinity();
})();
