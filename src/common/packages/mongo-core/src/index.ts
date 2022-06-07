import 'reflect-metadata';
import { connect, createConnection } from './connection';

export default {
  connect,
  createConnection,
};

export * from './connection';
export * from './DocumentType';
export * from './decorators';
