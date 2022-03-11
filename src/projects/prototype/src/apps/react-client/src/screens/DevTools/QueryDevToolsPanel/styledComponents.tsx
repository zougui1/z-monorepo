import { styled } from '@mui/material';

import { theme as color } from './theme';

export const Panel = styled('div')(({ theme }) => ({
  fontSize: 'clamp(12px, 1.5vw, 14px)',
  fontFamily: `sans-serif`,
  display: 'flex',
  backgroundColor: color.background,
  color: color.foreground,

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '.9em',
  },
}));

export const ActiveQueryPanel = styled('div')(({ theme }) => ({
  flex: '1 1 500px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  height: '100%',

  [theme.breakpoints.down('md')]: {
    borderTop: `2px solid ${color.gray}`,
  },
}));

export const Button = styled('button')(({ disabled }) => ({
  appearance: 'none',
  fontSize: '.9em',
  fontWeight: 'bold',
  background: color.gray,
  border: '0',
  borderRadius: '.3em',
  color: 'white',
  padding: '.5em',
  opacity: disabled ? '.5' : undefined,
  cursor: 'pointer',
}));

export const Code = styled('code')(() => ({
  fontSize: '.9em',
  color: 'inherit',
  background: 'inherit',
}));

export const Input = styled('input')(() => ({
  backgroundColor: color.inputBackgroundColor,
  border: 0,
  borderRadius: '.2em',
  color: color.inputTextColor,
  fontSize: '.9em',
  lineHeight: `1.3`,
  padding: '.3em .4em',
}));

export const Select = styled('select')(({ theme }) => ({
  display: 'inline-block',
  fontSize: '.9em',
  fontFamily: 'sans-serif',
  fontWeight: 'normal',
  lineHeight: '1.3',
  padding: '.3em 1.5em .3em .5em',
  height: 'auto',
  border: 0,
  borderRadius: '.2em',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundColor: color.inputBackgroundColor,
  backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' fill=\'%23444444\'><polygon points=\'0,25 100,25 50,75\'/></svg>")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right .55em center',
  backgroundSize: '.65em auto, 100%',
  color: color.inputTextColor,

  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));
