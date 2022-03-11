import { Query } from 'react-query'
import { SxProps, Theme as MuiTheme } from '@mui/material';

import { Theme } from './theme';

export function getQueryStatusColor(query: Query, theme: Theme) {
  const colorByStatus = {
    fetching: theme.active,
    inactive: theme.gray,
    stale: theme.warning,
    fresh: theme.success,
  };

  return colorByStatus[getQueryStatusLabel(query)];
}

export function getQueryStatusLabel(query: Query) {
  if (query.state.isFetching) return 'fetching';
  if (!query.getObserversCount()) return 'inactive';
  if (query.isStale()) return 'stale';

  return 'fresh';
}

export const getStatusRank = (q: Query) => {
  const rankByStatus = {
    fetching: 0,
    inactive: 3,
    stale: 2,
    fresh: 1,
  };

  return rankByStatus[getQueryStatusLabel(q)];
}

export const sortFns: Record<string, (a: Query, b: Query) => number> = {
  'Status > Last Updated': (a, b) =>
    getStatusRank(a) === getStatusRank(b)
      ? (sortFns['Last Updated']?.(a, b) as number)
      : getStatusRank(a) > getStatusRank(b)
        ? 1
        : -1,
  'Query Hash': (a, b) => (a.queryHash > b.queryHash ? 1 : -1),
  'Last Updated': (a, b) =>
    a.state.dataUpdatedAt < b.state.dataUpdatedAt ? 1 : -1,
};

export const makeSx = <T extends Record<string, SxProps<MuiTheme>> = Record<string, SxProps<MuiTheme>>>(styles: T): T => {
  return styles;
}
