import { downloadPage } from './downloadPage';
import { getSearch } from '../search';

export const downloadFuraffinity = async (): Promise<void> => {
  let hasMoreCommissions = true;

  while (hasMoreCommissions) {
    const { result: search } = await getSearch();

    console.group('downloading page', search.options?.page);
    const medias = await downloadPage(search);
    console.groupEnd();

    hasMoreCommissions = medias.length > 0;
  }

  console.log('No more commission to download.');
}
