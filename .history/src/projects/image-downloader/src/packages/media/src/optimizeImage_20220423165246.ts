import path from 'node:path';

import { makeMultiImagePreviews, Percent, MultiPreviewsResult } from '@zougui/common.fs-utils';
import env from '@zougui/common.env/node';

const widths: Record<string, Percent | number> = {
  sm: 200,
  md: '50%',
  lg: '70%',
};

export const optimizeImage = async (filePath: string): Promise<OptimizeImageResult[]> => {
  const dir = path.join(env.APP_WORKSPACE, 'downloads/variants');

  const results = await makeMultiImagePreviews(filePath, {
    destDir: dir,
    widths: Object.values(widths),
    formats: ['original', 'avif', 'webp'],
  });

  results.map(result => {
    const entries = Object.entries(result) as [keyof typeof result, (typeof result)[keyof typeof result]][];

    return entries.reduce((result, [formatName, formatValue]) => {
      if (typeof formatValue !== 'object') {
        (result as any)[formatName] = formatValue;
        return result;
      }

      const [label] = Object.entries(widths).find(([label, width]) => width === result.width) || ['unknown'];

      (result as any)[formatName] = {
        ...formatValue,
        label,
      };

      return result;
    }, {} as OptimizeImageResult);
  })
}

export type OptimizeImageResult = MultiPreviewsResult<'original' | 'avif' | 'webp', { label: string }>;
