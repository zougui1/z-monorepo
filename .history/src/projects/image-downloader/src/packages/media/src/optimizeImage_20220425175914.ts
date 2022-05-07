import { makeMultiImagePreviews, Percent, MultiPreviewsResult } from '@zougui/common.fs-utils';

import { mediaVariantsDir } from './constants';

const widths: Record<string, Percent | number> = {
  sm: 200,
  md: '50%',
  lg: '70%',
};

export const optimizeImage = async (filePath: string): Promise<OptimizeImageResult[]> => {
  const results = await makeMultiImagePreviews(filePath, {
    destDir: mediaVariantsDir,
    widths: Object.values(widths),
    formats: ['original', 'avif', 'webp'],
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
}

export type OptimizeImageResult = MultiPreviewsResult<'original' | 'avif' | 'webp', { label: string }>;
