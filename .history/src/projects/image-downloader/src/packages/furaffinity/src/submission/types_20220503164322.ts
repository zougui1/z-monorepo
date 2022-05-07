import { DescriptionTree } from '../description';
import { SubmissionRating } from '../rating';

export interface Submission {
  id: string;
  url: string;
  downloadUrl: string;
  fileName: string;
  title: string;
  publishedAt: Date;
  rating: SubmissionRating;
  tags: string[];
  author: SubmissionAuthor;
  description: DescriptionTree;
  categories: string[];
  species: string[];
  genders: string[];
}

export interface SubmissionAuthor {
  id: string;
  name: string;
  url: string;
  avatar?: string | undefined;
}
