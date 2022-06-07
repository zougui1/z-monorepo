import { makeMultiImagePreviews, Percent, MultiPreviewsResult, MultiOptimizeSupportedFormats } from '@zougui/common.fs-utils';
import { createException } from '@zougui/common.error-utils';
import { createTaskLogs } from '@zougui/log.logger/node';

import { mediaVariantsDir } from '../constants';

const widths: Record<string, Percent | number> = {
  sm: 200,
  md: '50%',
  lg: '70%',
};

const formats: MultiOptimizeSupportedFormats[] = ['original', 'avif', 'webp'];

//#region logging
const OptimizeImageError = createException<void, unknown>({
  name: 'OptimizeImageError',
  code: 'error.image-downloader.media.optimizeImage',
  message: ({ cause }) => `An error occured while optimizing submission file: ${cause.message}`,
  version: 'v1',
});

const OptimizeImageTaskLog = createTaskLogs<{ args: [filePath: string] }, { result: OptimizeImageResult[] }, Error>({
  baseCode: 'image-downloader.media.downloadSubmissions',
  namespace: 'zougui:image-downloader:media',
  version: 'v1',
})
  .formatters({
    start: ({ data }) => ({
      filePath: data.args[0],
    }),
    error: ({ cause }) => new OptimizeImageError({ cause }),
  })
  .messages({
    start: ({ data }) => `Optimizing submission file "${data.filePath}"`,
    success: 'Successfully optimized submission file',
    error: ({ cause }) => cause.message,
  });
//#endregion

export const optimizeImage = OptimizeImageTaskLog.wrap(async (filePath: string): Promise<OptimizeImageResult[]> => {
  const results = await makeMultiImagePreviews(filePath, {
    destDir: mediaVariantsDir,
    widths: Object.values(widths),
    formats,
  });

  const labelledResults = results.map(result => {
    const resultWidth = result.width;
    const entries = Object.entries(result) as [keyof typeof result, (typeof result)[keyof typeof result]][];

    return entries.reduce((result, [formatName, formatValue]) => {
      if (typeof formatValue !== 'object') {
        (result as any)[formatName] = formatValue;
        return result;
      }

      const [label] = Object.entries(widths).find(([label, width]) => width === resultWidth) || ['unknown'];

      (result as any)[formatName] = {
        ...formatValue,
        label,
      };

      return result;
    }, {} as OptimizeImageResult);
  });

  return labelledResults;
});

export type OptimizeImageResult = MultiPreviewsResult<'original' | 'avif' | 'webp', { label: string }>;
