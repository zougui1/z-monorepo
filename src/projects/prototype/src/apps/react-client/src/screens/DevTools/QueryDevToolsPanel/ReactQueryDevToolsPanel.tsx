import React from 'react';
import { useQueryClient } from 'react-query'
import { matchSorter } from 'match-sorter'

import { useLocalStorage, useSafeState } from './temp'
import {
  Panel,
  Button,
  Code,
  ActiveQueryPanel,
} from './styledComponents'
import Explorer from './Explorer';
import { useStyles } from './ReactQueryDevToolsPanel.styles';
import { QueryStatusContainer } from './QueryStatusContainer';
import { theme } from './theme';
import { getQueryStatusColor, getQueryStatusLabel, sortFns } from './utils';
import { SortSelect } from './SortSelect';
import { FilterInput } from './FilterInput';
import { QueryList } from './QueryList';

const isServer = typeof window === 'undefined'

const noop = () => {}

export function ReactQueryDevtoolsPanel(): React.ReactElement {
  const classes = useStyles();

  const queryClient = useQueryClient()
  const queryCache = queryClient.getQueryCache()

  const [sort, setSort] = useLocalStorage(
    'zougui.devtools.sortFn',
    Object.keys(sortFns)[0]
  )

  const [filter, setFilter] = useLocalStorage('zougui.devtools.filter', '')

  const [sortDesc, setSortDesc] = useLocalStorage(
    'zougui.devtools.sortDesc',
    false
  )

  const sortFn = React.useMemo(() => sortFns[sort as string], [sort])

  React[isServer ? 'useEffect' : 'useEffect'](() => {
    if (!sortFn) {
      setSort(Object.keys(sortFns)[0] as string)
    }
  }, [setSort, sortFn])

  const [unsortedQueries, setUnsortedQueries] = useSafeState(
    Object.values(queryCache.findAll())
  )

  const [activeQueryHash, setActiveQueryHash] = useLocalStorage(
    'zougui.devtools.activeQueryHash',
    ''
  )

  const queries = React.useMemo(() => {
    const sorted = [...unsortedQueries].sort(sortFn)

    if (sortDesc) {
      sorted.reverse()
    }

    if (!filter) {
      return sorted
    }

    return matchSorter(sorted, filter, { keys: ['queryHash'] }).filter(
      d => d.queryHash
    )
  }, [sortDesc, sortFn, unsortedQueries, filter])

  const activeQuery = React.useMemo(() => {
    return queries.find(query => query.queryHash === activeQueryHash)
  }, [activeQueryHash, queries])

  React.useEffect(() => {
    const unsubscribe = queryCache.subscribe(() => {
      setUnsortedQueries(Object.values(queryCache.getAll()))
    })
    // re-subscribing after the panel is closed and re-opened won't trigger the callback,
    // So we'll manually populate our state
    setUnsortedQueries(Object.values(queryCache.getAll()))

    return unsubscribe
  }, [sort, sortFn, sortDesc, setUnsortedQueries, queryCache])

  const handleRefetch = () => {
    const promise = activeQuery?.fetch()
    promise?.catch(noop)
  }

  return (
    <Panel
      className={classes.root}
      aria-label="React Query Devtools Panel"
    >
      <div className={classes.leftPart}>
        <div className={classes.leftContainer}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <QueryStatusContainer queries={queries} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FilterInput value={filter} onChange={setFilter} />

              {!filter && (
                <SortSelect
                  sort={sort}
                  sortDesc={sortDesc}
                  onSort={setSort}
                  onSortDesc={setSortDesc}
                />
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            overflowY: 'auto',
            flex: '1',
          }}
        >
          <QueryList
            queries={queries}
            activeQuery={activeQuery}
            onClick={query =>
              setActiveQueryHash(
                activeQueryHash === query.queryHash ? '' : query.queryHash
              )
            }
          />
        </div>
      </div>

      {activeQuery ? (
        <ActiveQueryPanel>
          <div
            style={{
              padding: '.5em',
              background: theme.backgroundAlt,
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            Query Details
          </div>
          <div
            style={{
              padding: '.5em',
            }}
          >
            <div
              style={{
                marginBottom: '.5em',
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'space-between',
              }}
            >
              <Code
                style={{
                  lineHeight: '1.8em',
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    padding: 0,
                    overflow: 'auto',
                  }}
                >
                  {JSON.stringify(activeQuery.queryKey, null, 2)}
                </pre>
              </Code>
              <span
                style={{
                  padding: '0.3em .6em',
                  borderRadius: '0.4em',
                  fontWeight: 'bold',
                  textShadow: '0 2px 10px black',
                  background: getQueryStatusColor(activeQuery, theme),
                  flexShrink: 0,
                }}
              >
                {getQueryStatusLabel(activeQuery)}
              </span>
            </div>
            <div
              style={{
                marginBottom: '.5em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              Observers: <Code>{activeQuery.getObserversCount()}</Code>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              Last Updated:{' '}
              <Code>
                {new Date(
                  activeQuery.state.dataUpdatedAt
                ).toLocaleTimeString()}
              </Code>
            </div>
          </div>
          <div
            style={{
              background: theme.backgroundAlt,
              padding: '.5em',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            Actions
          </div>
          <div
            style={{
              padding: '0.5em',
            }}
          >
            <Button
              type="button"
              onClick={handleRefetch}
              disabled={activeQuery.state.isFetching}
              style={{
                background: theme.active,
              }}
            >
              Refetch
            </Button>{' '}
            <Button
              type="button"
              onClick={() => queryClient.invalidateQueries(activeQuery)}
              style={{
                background: theme.warning,
                color: theme.inputTextColor,
              }}
            >
              Invalidate
            </Button>{' '}
            <Button
              type="button"
              onClick={() => queryClient.resetQueries(activeQuery)}
              style={{
                background: theme.gray,
              }}
            >
              Reset
            </Button>{' '}
            <Button
              type="button"
              onClick={() => queryClient.removeQueries(activeQuery)}
              style={{
                background: theme.danger,
              }}
            >
              Remove
            </Button>
          </div>
          <div
            style={{
              background: theme.backgroundAlt,
              padding: '.5em',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            Data Explorer
          </div>
          <div
            style={{
              padding: '.5em',
            }}
          >
            <Explorer
              label="Data"
              value={activeQuery?.state?.data}
              defaultExpanded={{}}
            />
          </div>
          <div
            style={{
              background: theme.backgroundAlt,
              padding: '.5em',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            Query Explorer
          </div>
          <div
            style={{
              padding: '.5em',
            }}
          >
            <Explorer
              label="Query"
              value={activeQuery}
              defaultExpanded={{
                queryKey: true,
              }}
            />
          </div>
        </ActiveQueryPanel>
      ) : null}
    </Panel>
  );
}
