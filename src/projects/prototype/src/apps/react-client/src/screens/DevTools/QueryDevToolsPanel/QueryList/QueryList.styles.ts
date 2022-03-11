import { makeSx } from '../utils';
import { theme } from '../theme';

export const styles = makeSx({
  item: {
    display: 'flex',
    borderBottom: `solid 1px ${theme.grayAlt}`,
    cursor: 'pointer',

    active: {
      backgroundColor: 'rgba(255, 255, 255, .1)',
    },
  },

  observerCount: {
    flex: '0 0 auto',
    width: '2em',
    height: '2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    textShadow: '0 0 10px black',
    color: 'white',

    stale: {
      textShadow: '0',
      color: 'black',
    },
  },

  disabledContent: {
    flex: '0 0 auto',
    height: '2em',
    background: theme.gray,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    padding: '0 0.5em',
  },

  hashContent: {
    padding: '.5em',
  },
});
