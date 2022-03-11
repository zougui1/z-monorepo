import { Box } from '@mui/material';
import { Query, QueryKey } from 'react-query';

import { styles } from './QueryStatusContainer.styles';
import { QueryStatus } from '../QueryStatus';
import { theme } from '../theme';
import { getQueryStatusLabel } from '../utils';

export function QueryStatusContainer({ queries }: QueryStatusContainerProps) {
  const freshQueryCount = queries.filter(q => getQueryStatusLabel(q) === 'fresh')
    .length
  const fetchingQueryCount = queries.filter(q => getQueryStatusLabel(q) === 'fetching')
    .length
  const staleQueryCount = queries.filter(q => getQueryStatusLabel(q) === 'stale')
    .length
  const inactiveQueryCount = queries.filter(q => getQueryStatusLabel(q) === 'inactive')
    .length

  return (
    <Box
      component="span"
      sx={styles.root}
    >
      <QueryStatus
        backgroundColor={theme.success}
        queryCount={freshQueryCount}
        label="fresh"
      />

      <QueryStatus
        backgroundColor={theme.active}
        queryCount={fetchingQueryCount}
        label="fetching"
      />

      <QueryStatus
        backgroundColor={theme.warning}
        queryCount={staleQueryCount}
        label="stale"
        sx={{
          color: 'black',
          textShadow: '0',
        }}
      />

      <QueryStatus
        backgroundColor={theme.gray}
        queryCount={inactiveQueryCount}
        label="inactive"
      />
    </Box>
  );
}

export interface QueryStatusContainerProps {
  queries: Query<unknown, unknown, unknown, QueryKey>[];
}
