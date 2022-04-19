import type { Ref } from '@typegoose/typegoose';
import type { Types } from 'mongoose';

import type { DocumentType } from '@zougui/common.mongo-core';

import { compact } from './compact';

export const isNewRef = <T>(ref: Ref<T, Types.ObjectId | undefined>): ref is T => {
  return typeof ref === 'object' && (!('_id' in ref) || !ref._id);
}

export const createRef = async <T>(
  ref: Ref <T, Types.ObjectId | undefined>,
  getDocument: (value: T) => Promise<DocumentType<T>>,
): Promise<DocumentType<T> | Types.ObjectId | undefined> => {
  if (!isNewRef(ref)) {
    return ref;
  }

  return await getDocument(ref);
}

export const createRefList = async <T>(
  refs: Ref <T, Types.ObjectId | undefined>[],
  createMany: (values: T[]) => Promise<DocumentType<T>[]>,
  identifyRefBy: (value: T) => unknown,
): Promise<DocumentType<T>[]> => {
  const newRefs = refs.filter(isNewRef);
  const newDocs = await createMany(newRefs);

  return compact(refs.map(ref => {
    if (!isNewRef(ref)) {
      return;
    }

    return newDocs.find(newDoc => identifyRefBy(newDoc) === identifyRefBy(ref));
  }));
}
