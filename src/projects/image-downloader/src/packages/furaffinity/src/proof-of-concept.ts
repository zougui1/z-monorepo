import { login, search } from 'furaffinity-api';
import { Interval } from 'luxon';

import { cookieA, cookieB } from './constants';

const includedTags = [
  'dragon',
  'dragons',
  'wolf',
  'wolves',
  'dog',
  'raptor',
  'bird',
  'avian',
  'gryphon',
  'gryphons',
  'monster',
  'dragons',
  'tentacle',
  'tentacles',
];

const exlcudedTags = [
  'fart',
  'scat',
  'diaper',
  'dbz',
  'dragonballz',
  'dragon_ball_z',
  'taur',
  '(dragon ball z)',
].map((tag) => `!${tag}`);

const excludedKeywords = [
  'bodybuilder',
].map((tag) => `!${tag}`);

const includedTagsStr = includedTags.join(' | ');
const exlcudedTagsStr = exlcudedTags.join(' ');
const excludedKeywordsStr = `@keywords ${excludedKeywords.join(' ')}`;
const searchStr = `${includedTagsStr} ${exlcudedTagsStr} ${excludedKeywordsStr}`;
console.log({ searchStr });

let i = 0;

const searchThrough = async (options: SearchThroughOptions) => {
  console.group('page', options.page);

  const range = (options.rangeFrom && options.rangeTo) ? 'manual' : '3days';

  const submissions = await search(searchStr, {
    page: options.page,
    orderBy: 'date',
    range,
  });
  const lastSubmissionResult = submissions[submissions.length - 1];

  if (!lastSubmissionResult) {
    console.log('no more submissions');
    return;
  }

  const lastSubmission = await lastSubmissionResult.getSubmission();

  if (!lastSubmission) {
    console.log('submission not found');
    return;
  }

  const publishDate = new Date(lastSubmission.posted);

  const interval = Interval.before(publishDate, { day: 3 });

  const today = new Date();

  const shouldBeManualRange = (
    publishDate.getFullYear() !== today.getFullYear() ||
    publishDate.getMonth() !== today.getMonth() ||
    publishDate.getDate() !== today.getDate()
  );

  console.groupEnd();

  if (i++ > 100) {
    return;
  }

  await searchThrough({
    page: options.page + 1,
    rangeFrom: shouldBeManualRange ? interval.start.toJSDate() : undefined,
    rangeTo: shouldBeManualRange ? interval.end.toJSDate() : undefined,
  });
};

export interface SearchThroughOptions {
  page: number;
  rangeFrom?: Date | undefined;
  rangeTo?: Date | undefined;
}

(async () => {
  login(cookieA, cookieB);


  await searchThrough({
    page: 14,
    //rangeFrom: new Date('2022-04-15'),
    //rangeTo: new Date('2022-04-18'),
  });
})();
