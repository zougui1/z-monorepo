const logicalOperator = (operator: LogicalOperators): string => {
  const operatorMap: Record<LogicalOperators, string> = {
    and: ' & ',
    or: ' | ',
    none: ' ',
  };

  return operatorMap[operator];
}

type LogicalOperators = 'and' | 'or' | 'none';

const group = (items: string[], options?: GroupOptions | undefined): string => {
  const group = items.join(logicalOperator(options?.logicalOperator || 'none'));
  const prefix = options?.not ? '!' : '';

  return `${prefix}(${group})`;
}

interface GroupOptions {
  logicalOperator?: LogicalOperators | undefined;
  not?: boolean | undefined;
}

const dragonTerms = [
  'dragon',
  'dragoness',
  'dragons',
  'wingsoffire',
  group(['wings', 'of', 'fire']),
];

export const furaffinityQuerySearch = [
  group([
    ...dragonTerms,
    'wolf',
    'wolves',
    'dog',
    'raptor',
    'gryphon',
    'gryphons',
    'monster',
    'tentacle',
    'tentacles',
    '@keywords dinosaur',
    'dino',
    'bird',
    'avian',
  ], { logicalOperator: 'or' }),
  group([
    'mlp',
    group([
      ...dragonTerms,
      'monster',
      'tentacle',
      'tentacles',
    ]),
  ], { not: true }),
  '!fart',
  '!scat',
  '!diaper',
  '!dbz',
  '!dragonballz',
  '!dragon_ball_z',
  '!taur',
  group([
    'dragon',
    'ball',
    'z',
  ], { not: true }),
  '@keywords !bodybuilder',
  '!poo',
  '!poop',
  '!pee',
  '!piss',
  '!breast_growth',
  '!stomp',
  '!hyper_ass',
  '!hyper_butt',
  '!weight_gain',
  '!satyr',
  '!huge_breasts',
  '!hyper_breasts',
  '!huge_butt',
  '!hyperfat',
  '!fatfetish',
  '!hyper_fat',
  '!fat_fetish',
  '!obese',
  '!multi_breast',
  '!multi_breasts',
  '!hyper_pussy',
  '!shaftbeast',
  '!shaft_beast',
  '!cockteats',
  '!cock_teats',
  '!cocktits',
  '!cock_tits',
  '!udderballs',
  '!udder_balls',
  '!dicknipples',
  '!dick_nipples',
  '!nudders',
  '!decapitation',
  '!decapited',
  '!decap',
  '!lactation',
  group([
    'vore',
    group([
      'digest',
      'digestion',
      'digested',
      'intestine',
      'intestines',
      'acid',
    ], { logicalOperator: 'or' }),
  ], { not: true }),
  group([
    group([
      'muscle',
      'muscles',
      'muscular',
    ], { logicalOperator: 'or' }),
    group([
      ...dragonTerms,
      'dino',
      'dinosaur',
      'raptor',
      'gryphon',
      'gryphons',
      'monster',
    ], { not: true, logicalOperator: 'or' }),
  ], { not: true }),
  group([
    group(['fat', 'chubby'], { logicalOperator: 'or' }),
    'hyper',
  ], { not: true }),
  group([
    group(['hyper', 'macro'], { logicalOperator: 'or' }),
    group(['muscle', 'muscles', 'muscular'], { logicalOperator: 'or' }),
  ], { not: true }),
].join(' ');
