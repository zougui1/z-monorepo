import { SxProps, Theme as MuiTheme } from '@mui/material';

export const makeStyles = <T extends Record<string, SxProps<MuiTheme>> = Record<string, SxProps<MuiTheme>>>(styles: T): T => {
  return styles;
}
