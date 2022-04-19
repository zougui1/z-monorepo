import type { Document, ObjectId } from 'mongoose';
import type { BeAnObject, IObjectWithTypegooseFunction } from '@typegoose/typegoose/lib/types';

export type DocumentType<
  Doc extends Record<string, any>,
  TObjectId = ObjectId,
  TDoc = any,
  TQueryHelpers = BeAnObject,
  DocType = any,
> = (
  & Document<TDoc, TQueryHelpers, DocType>
  & Doc
  & IObjectWithTypegooseFunction
  & { _id: TObjectId; }
)
