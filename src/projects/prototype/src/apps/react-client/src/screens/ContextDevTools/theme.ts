import { darken, lighten } from '@mui/material/styles';

const background = '#282c34';

export const theme = {
  primaryBackground: lighten(background, 0.02),
  secondaryBackground: darken(background, 0.3),
  red: '#e06c75',
  green: '#98c379',
  gray: '#abb2bf',
  blue: '#61afef',
}
