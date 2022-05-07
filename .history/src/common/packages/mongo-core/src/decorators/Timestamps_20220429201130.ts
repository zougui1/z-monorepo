import { modelOptions } from '@typegoose/typegoose';

export const Timestamps = (): ClassDecorator => {
  return modelOptions({ schemaOptions: { timestamps: true } });
}

export interface WithTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export type OmitTimestamps<T extends Record<string, any>> = Omit<T, 'createdAt' | 'updatedAt'>;
