import * as uuid from 'uuid';

import { useConst } from '../useConst';

export const useId = (providedId?: string | undefined): string => {
  const generatedId = useConst(() => uuid.v4());
  const id = providedId || generatedId;

  return id;
}
