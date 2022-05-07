import type { Ref } from '@typegoose/typegoose/lib/types';
import type { Types } from 'mongoose';


import type { MediaCreation } from './types';
import { userQueries, User, UserDocument } from '../user';
import { createRefList, isNewRef } from '../createRef';
import { compact } from '../compact';

/**
 * create all references of the media
 * @param media
 * @returns
 */
export const createMediaRefs = async (media: MediaCreation): Promise<MediaCreation> => {
  return await createMediaUserRefs(media);
}

/**
 * create references to the collection 'users' for the authors
 * @param media
 * @returns
 */
const createMediaUserRefs = async (media: MediaCreation): Promise<MediaCreation> => {
  const authorsDocs = await createRefList(
    media.posts.flatMap(post => post.authors),
    userQueries.createMany,
    author => author.name,
  );

  const posts = media.posts.map(post => {
    return {
      ...post,
      authors: getAuthorsFromDocuments(post.authors, authorsDocs),
    };
  });

  return {
    ...media,
    posts,
  };
}

/**
 * get the authors either as object ID or from the documents
 * @param authors original authors
 * @param authorsDocs documents of the authors that were created
 * @returns
 */
const getAuthorsFromDocuments = (
  authors: Ref<User, Types.ObjectId | undefined>[],
  authorsDocs: UserDocument[]
): (Types.ObjectId | UserDocument)[] => {
  return compact(authors.map(author => {
    if(!isNewRef(author)) {
      return author;
    }

    return authorsDocs.find(newAuthor => newAuthor.name === author.name);
  }));
}
