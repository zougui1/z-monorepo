import { Dispatch, SetStateAction } from 'react';

import { Select, Button } from '../styledComponents';
import { sortFns } from '../utils';

export function SortSelect({ sort, sortDesc, onSort, onSortDesc }: SortSelectProps) {
  return (
    <>
      <Select
        aria-label="Sort queries"
        value={sort}
        onChange={e => onSort(e.target.value)}
        style={{
          flex: '1',
          minWidth: 75,
          marginRight: '.5em',
        }}
      >
        {Object.keys(sortFns).map(key => (
          <option key={key} value={key}>
            Sort by {key}
          </option>
        ))}
      </Select>

      <Button
        type="button"
        onClick={() => onSortDesc(old => !old)}
        style={{
          padding: '.3em .4em',
        }}
      >
        {sortDesc ? '⬇ Desc' : '⬆ Asc'}
      </Button>
    </>
  );
}

export interface SortSelectProps {
  sort: string;
  sortDesc: boolean;
  onSort: (sortBy: string) => void;
  onSortDesc: Dispatch<SetStateAction<boolean>>;
}
