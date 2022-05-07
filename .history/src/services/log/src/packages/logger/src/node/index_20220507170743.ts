import { nanoid } from 'nanoid';
import base85 from 'base85';

const id = nanoid(16);
const idBase64 = Buffer.from(id).toString('base64');
const idBase85 = base85.encode(id);

console.log('id:', id);
console.log('base64:', idBase64);
console.log('base85:', idBase85);
console.log('lengths:', {
  id: id.length,
  base64: idBase64.length,
  base85: idBase85.length,
})

export * from './createLog';
export * from './createTaskLogs';
export * from '../common';
