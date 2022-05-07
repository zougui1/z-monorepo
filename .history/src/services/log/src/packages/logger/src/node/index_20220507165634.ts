import { nanoid } from 'nanoid';

const id = nanoid();

console.log('id:', id);
console.log('base64:', Buffer.from(id).toString('base64url'))

export * from './createLog';
export * from './createTaskLogs';
export * from '../common';
