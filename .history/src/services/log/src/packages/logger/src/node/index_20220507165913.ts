import { nanoid } from 'nanoid';

const id = nanoid();
const idBase64 = Buffer.from(id).toString('hex');

console.log('id:', id);
console.log('base64:', idBase64);
console.log('lengths:', {
  id: id.length,
  base64: idBase64.length,
})

export * from './createLog';
export * from './createTaskLogs';
export * from '../common';
