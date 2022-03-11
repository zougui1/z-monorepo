import { Box } from '@mui/material';
import { Query } from 'react-query'

import { styles } from './QueryList.styles';
import { Code } from '../styledComponents';
import { getQueryStatusColor, getQueryStatusLabel } from '../utils';
import { theme } from '../theme';

export function QueryList({ queries, onClick, activeQuery }: QueryListProps) {
  return (
    <>
      {queries.map((query, i) => {
        const isDisabled = query.getObserversCount() > 0 && !query.isActive()
        const isStale = getQueryStatusLabel(query) === 'stale';
        const isActiveQuery = query === activeQuery;

        return (
          <Box
            component="div"
            key={query.queryHash || i}
            role="button"
            aria-label={`Open query details for ${query.queryHash}`}
            onClick={() => onClick(query)}
            sx={[styles.item, isActiveQuery && styles.item.active]}
          >
            <Box
              component="div"
              sx={[
                styles.observerCount,
                { backgroundColor: getQueryStatusColor(query, theme) },
                isStale && styles.observerCount.stale,
              ]}
            >
              {query.getObserversCount()}
            </Box>

            {isDisabled && (
              <Box component="div" sx={styles.disabledContent}>
                disabled
              </Box>
            )}

            <Code style={styles.hashContent}>
              {String(query.queryHash)}
            </Code>
          </Box>
        )
      })}
    </>
  );
}

export interface QueryListProps {
  queries: Query[];
  activeQuery: Query | undefined;
  onClick: (query: Query) => void;
}
