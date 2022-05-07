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
  'dinosaur',
  'wingsoffire',
  'raptor',
  '(wings of fire)',
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
export const furaffinityQuerySearch = `${includedTagsStr} ${exlcudedTagsStr} ${excludedKeywordsStr}`;
console.log({furaffinityQuerySearch})
