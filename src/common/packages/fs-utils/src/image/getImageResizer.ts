import type sharp from 'sharp';

import { parsePercent } from '@zougui/common.string-utils';
import type { Percent } from '@zougui/common.type-utils';

export async function getImageResizer(
  sharp: sharp.Sharp,
  width?: number | Percent | undefined,
  height?: number | Percent | undefined,
  options?: sharp.ResizeOptions | undefined,
): Promise<sharp.Sharp>;
export async function getImageResizer(
  sharp: sharp.Sharp,
  options?: sharp.ResizeOptions | undefined,
): Promise<sharp.Sharp>;
export async function getImageResizer(
  sharp: sharp.Sharp,
  widthOrOptions?: number | Percent | sharp.ResizeOptions | undefined,
  height?: number | Percent | undefined,
  options?: sharp.ResizeOptions | undefined,
): Promise<sharp.Sharp> {
  if (typeof widthOrOptions === 'object') {
    return sharp.resize(widthOrOptions);
  }

  if (typeof widthOrOptions !== 'string' && typeof height !== 'string') {
    return sharp.resize(widthOrOptions, height, options);
  }

  const metadata = await sharp.clone().metadata();
  const widthMultiplier = typeof widthOrOptions === 'string'
    ? parsePercent(widthOrOptions)
    : widthOrOptions;
  const heightMultiplier = typeof height === 'string'
    ? parsePercent(height)
    : height;

  if (
    (
      metadata.width === undefined &&
      widthMultiplier !== undefined
    ) ||
    (
      metadata.height === undefined &&
      heightMultiplier !== undefined
    )
  ) {
    throw new Error('Couldn\'t find the image\'s size to dynamically resize it');
  }

  const actualWidth = (
    metadata.width &&
    widthMultiplier &&
    Math.round(metadata.width * widthMultiplier)
  );

  const actualHeight = (
    metadata.height &&
    heightMultiplier &&
    Math.round(metadata.height * heightMultiplier)
  );

  return sharp.resize(actualWidth, actualHeight, options);
}
