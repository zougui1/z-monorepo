import { downloadManyMusics } from './downloadManyMusics';
import { sanitizeUrls } from '../../sanitizeUrls';

export const download = async (urls: readonly string[]): Promise<void> => {
  const sanitizedUrls = await sanitizeUrls(urls);
  await downloadManyMusics(sanitizedUrls);
}
