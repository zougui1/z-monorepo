const query = (queryObjects: FaSearchQuery[]): string => {
  const rawQuery = queryObjects.reduce((rawQuery, currentQueryObj) => {
    if ('includeTags' in currentQueryObj) {
      const included = currentQueryObj.includeTags
        .map(tag => {
          if (typeof tag === 'string') {
            return tag;
          }

          if (typeof tag[0] === 'string') {
            return tag.join(' ');
          }

          return query(tag as FaSearchQuery[]);
        })
        .join(' ');

      return `${rawQuery} ${included}`;
    }

    return rawQuery;
  }, '');

  return rawQuery;
}

export interface QueryIncludeTags {
  includeTags: (string | string[] | FaSearchQuery[])[];
}

export interface QueryExcludeTags {
  excludeTags: (string | string[] | FaSearchQuery[])[];
}

export interface QueryExcludeKeywords {
  excludeKeywords: (string | string[] | FaSearchQuery[])[];
}

export type FaSearchQuery = (
  | QueryIncludeTags
  | QueryExcludeTags
  | QueryExcludeKeywords
);
