import type sharp from 'sharp';

import { randomFilePath } from '@zougui/common.path-utils';
import type { Percent } from '@zougui/common.type-utils';

import {
  multiOptimizeImage,
  MultiOptimizeImageFormatsOptions,
  OptimizeImageOptions,
  MultiOptimizeSupportedFormats,
} from './multiOptimizeImage';

export const makeImagePreviews = async <FormatName extends MultiOptimizeSupportedFormats>(
  filePath: string,
  options: MakeImagePreviewsOptions<FormatName>,
): Promise<PreviewsResult<FormatName>> => {
  const { destDir, width, formats: formatNames } = options;

  const formats = formatNames.reduce((formats, formatName) => {
    formats[formatName] = {
      width,
      destFile: randomFilePath({ dir: destDir }),
    };

    return formats;
  }, {} as MultiOptimizeImageFormatsOptions);

  const outputs = await multiOptimizeImage(filePath, {
    formats,
    streamToTempFile: true,
  });

  const formatsEntries = Object.entries(formats) as [FormatName, OptimizeImageOptions][];
  const files = formatsEntries.reduce((files, [formatName, formatOptions]) => {
    const output = outputs.find(output => output.format === formatName)?.output as sharp.OutputInfo;
    files[formatName] = {
      format: formatName,
      file: formatOptions.destFile,
      output,
    }
    return files;
  }, {} as PreviewsResult<FormatName>);

  return files;
}

export interface MakeImagePreviewsOptions<FormatName extends MultiOptimizeSupportedFormats> {
  destDir: string,
  width: number | Percent;
  formats: FormatName[];
}

export type PreviewsResult<FormatName extends MultiOptimizeSupportedFormats, CustomProperties = unknown> = {
  [Key in FormatName]: {
    file: string;
    format: Key;
    output: sharp.OutputInfo;
  } & CustomProperties;
}
