import fs from 'fs-extra';

import type { Percent } from '@zougui/common.type-utils';

import { makeImagePreviews, PreviewsResult } from './makeImagePreviews';
import { MultiOptimizeSupportedFormats } from './multiOptimizeImage';

export const makeMultiImagePreviews = async <FormatName extends MultiOptimizeSupportedFormats>(
  filePath: string,
  options: MakeMultiImagePreviewsOptions<FormatName>,
): Promise<MultiPreviewsResult<FormatName>[]> => {
  const { destDir, widths, formats } = options;

  await fs.ensureDir(options.destDir);
  const results = await Promise.all(widths.map(async width => {
    const result = await makeImagePreviews(filePath, {
      destDir,
      width,
      formats,
    });

    return {
      ...result,
      width,
    };
  }));

  return results;
}

export interface MakeMultiImagePreviewsOptions<FormatName extends MultiOptimizeSupportedFormats> {
  destDir: string,
  widths: (number | Percent)[];
  formats: FormatName[];
}

export type MultiPreviewsResult<
  FormatName extends MultiOptimizeSupportedFormats,
  CustomProperties = unknown
> = PreviewsResult<FormatName, CustomProperties> & { width: Percent | number; }
