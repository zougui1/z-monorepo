import { SxProps, Theme } from '@mui/material';

export const mergeSx = (...styles: (SxProps<Theme> | undefined)[]): SxProps<Theme> => {
  const pristineStyles = styles.filter(Boolean) as SxProps<Theme>[];
  return pristineStyles.flat();
}
