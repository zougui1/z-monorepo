(global as any)._Br = require('tst-reflect');
export * from './media';
export * from './unprocessedMedia';
export * from './user';
export * from './search';
export * from './connection';

/*import { Document } from 'mongoose';
import mongoose from 'mongoose';

import { connect } from './connection';
import { MediaModel, Media, mediaQueries } from './media';
import { User } from './user';

(async () => {
  mongoose.connection.on('connected', () => {
    console.log('connected');
  });
  mongoose.connection.on('error', (err) => {
    console.log('connection error:', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('disconnected');
  });
  await connect().catch(() => {});

  //await createUsers();
  await createMedia();
  //await MediaModel.findOneAndUpdate({}, { title: 'new name' });

  //const medias = await findMedias();
  //await updateMedia(medias[0]);
  mongoose.disconnect();
})();

//mongoose.set('debug', true)


async function createMedia() {
  const siranor: User = {
    name: 'Siranor',
    profileUrls: ['https://furaffinity.net/user/siranor', 'https://siranor.sofurry.com/'],
  };

  const dradmon: User = {
    name: 'Dradmon',
    profileUrls: ['https://furaffinity.net/user/dradmon'],
  };

  await mediaQueries.create({
    type: 'image',
    fileName: 'some-dragon',
    extension: 'jpg',
    urls: ['https://furaffinity.net/view/1215415', 'https://e621.net/posts/5415184'],
    hash: 'some hash',
    tags: ['dragon', 'SFW'],
    authors: [siranor, dradmon],
    title: 'Cuddling dragons',
    description: 'Some dragons cuddling.',
    variants: [
      {
        type: 'image',
        fileName: 'some-dragon (NSFW)',
        title: 'Naughty dragons',
        description: 'Some dragons doing what dragons do best.',
        extension: 'jpg',
        hash: 'some hash',
        urls: ['https://furaffinity.net/view/1215416', 'https://e621.net/posts/5415185'],
        tags: ['dragon', 'NSFW'],
        authors: [siranor, dradmon],
      },
      {
        type: 'image',
        fileName: 'some-dragon (cum)',
        title: 'Messy dragons',
        description: 'Some dragons just did what dragons do best.',
        extension: 'jpg',
        hash: 'some hash',
        urls: ['https://furaffinity.net/view/1215417', 'https://e621.net/posts/5415186'],
        tags: ['dragon', 'NSFW', 'cum'],
        authors: [siranor, dradmon],
      }
    ],
  });
}

async function findMedias() {
  return await MediaModel.find();
}

async function updateMedia(media: Document & Media) {
  media.tags.push('NSFW');
  await media.save();
}
*/
