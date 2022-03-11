import { makeStyles } from '@mui/styles';

import { theme } from './theme';

export const useStyles = makeStyles({
  root: {
    width: '100%',
    boxShadow: '0 0 20px rgba(0,0,0,.3)',
    borderTop: `1px solid ${theme.gray}`,
    height: '100%',

    '& *': {
      scrollbarColor: `${theme.backgroundAlt} ${theme.gray}`,
    },

    '& *::-webkit-scrollbar, .ReactQueryDevtoolsPanel scrollbar': {
      width: '1em',
      height: '1em',
    },

    '& *::-webkit-scrollbar-track, .ReactQueryDevtoolsPanel scrollbar-track': {
      background: theme.backgroundAlt,
    },

    '& *::-webkit-scrollbar-thumb, .ReactQueryDevtoolsPanel scrollbar-thumb': {
      backgroundColor: theme.gray,
      borderRadius: '.5em',
      border: `3px solid ${theme.backgroundAlt}`,
    },
  },

  resizeHandle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '4px',
    marginBottom: '-4px',
    cursor: 'row-resize',
    zIndex: 100000,
  },

  leftPart: {
    flex: '1 1 500px',
    minHeight: '40%',
    maxHeight: '100%',
    overflow: 'auto',
    borderRight: `1px solid ${theme.grayAlt}`,
    display: 'flex',
    flexDirection: 'column',
  },

  leftContainer: {
    padding: '.5em',
    background: theme.backgroundAlt,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  logo: {
    marginRight: '.5em',
  },
});
