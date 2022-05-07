import { SearchDocument, UnprocessedMediaDocument } from '@zougui/image-downloader.database';

import { downloadSubmissions } from '../submission';
import { saveMedia } from '../submission-file';

export const downloadPage = async (search: SearchDocument): Promise<UnprocessedMediaDocument[]> => {
  const submissions = await downloadSubmissions(search);

  for (const submission of submissions) {
    console.group(`Submission "${submission.url}"`);
    await saveMedia(submission);
    console.groupEnd();
    console.log();
  }

  console.log('All submissions saved');

  return submissions;
}
