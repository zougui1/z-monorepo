import sharp from 'sharp';

import { Percent } from '@zougui/common.type-utils';

import { getImageResizer } from './getImageResizer';
import { useTempFile } from '../temp-node';

export const multiOptimizeImage = async (filePath: string, options: MultiOptimizeImageOptions) => {
  const { streamToTempFile } = options;
  const formats = Object.entries(options.formats) as [keyof MultiOptimizeImageFormatsOptions, FormattingOptions & OptimizeImageOptions][];

  const outputs = await Promise.all(formats.map(async ([format, options]) => {
    const { width, height, destFile, ...formatOptions } = options;
    const resizer = await getImageResizer(sharp(filePath), width, height);

    const formatter = format === 'original'
      ? resizer
      : resizer.toFormat(format, formatOptions);

    if (streamToTempFile) {
      return await useTempFile({ destFile }, async tempFile => {
        const output = await formatter.toFile(tempFile);

        return {
          format,
          output,
        };
      });
    }

    const output = await formatter.toFile(destFile);

    return {
      format,
      output,
    };
  }));

  return outputs;
}

export interface MultiOptimizeImageFormatsOptions {
  original?: OptimizeImageOptions | undefined;
  avif?: (OptimizeImageOptions & sharp.AvifOptions) | undefined;
  webp?: (OptimizeImageOptions & sharp.WebpOptions) | undefined;
  jpeg?: (OptimizeImageOptions & sharp.JpegOptions) | undefined;
  png?: (OptimizeImageOptions & sharp.PngOptions) | undefined;
}

export type MultiOptimizeSupportedFormats = keyof MultiOptimizeImageFormatsOptions;

export interface MultiOptimizeImageOptions {
  streamToTempFile?: boolean | undefined;
  formats: MultiOptimizeImageFormatsOptions;
}

export interface OptimizeImageOptions {
  width?: Percent | number | undefined;
  height?: Percent | number | undefined;
  destFile: string;
}

type FormattingOptions = (
  | sharp.AvifOptions
  | sharp.WebpOptions
  | sharp.JpegOptions
  | sharp.PngOptions
);
