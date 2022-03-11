import { styles } from './FilterInput.styles';
import { Input } from '../styledComponents';

export function FilterInput({ value, onChange }: FilterInputProps) {
  return (
    <Input
      placeholder="Filter"
      aria-label="Filter by queryhash"
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Escape') onChange('')
      }}
      style={styles.root}
    />
  );
}

export interface FilterInputProps {
  value: string | undefined;
  onChange: (filter: string) => void;
}
