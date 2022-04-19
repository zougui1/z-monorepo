import { Rating } from 'furaffinity-api';

export enum SubmissionRating {
  SFW = 'SFW',
  NSFW = 'NSFW',
  Any = 'Any',
}

export const getRating = (rating: Rating): SubmissionRating => {
  switch (rating) {
    case Rating.General:
      return SubmissionRating.SFW;
    case Rating.Mature:
    case Rating.Adult:
      return SubmissionRating.NSFW;
    default:
      return SubmissionRating.Any;
  }
}
