import path from 'node:path';

import { ISubmission, Category, Species, Gender } from 'furaffinity-api';

import { secureHttpProtocol } from '@zougui/common.url-utils';

import { parseDescription } from '../description';
import { getRating } from '../rating';
import { Submission } from './types';

export const formatSubmission = (submission: ISubmission): Submission => {
  const formattedSubmission: Submission = {
    id: submission.id,
    url: secureHttpProtocol(submission.url),
    downloadUrl: secureHttpProtocol(submission.downloadUrl),
    title: submission.title,
    fileName: path.basename(submission.downloadUrl),
    publishedAt: new Date(submission.posted),
    rating: getRating(submission.rating),
    tags: submission.keywords,
    author: {
      id: submission.author.id,
      name: submission.author.name,
      url: secureHttpProtocol(submission.author.url),
      avatar: submission.author.avatar && secureHttpProtocol(submission.author.avatar),
    },
    description: parseDescription(submission.description),
    categories: [Category[submission.content.category]],
    species: [Species[submission.content.species]],
    genders: [Gender[submission.content.gender]],
  };

  return formattedSubmission;
}
