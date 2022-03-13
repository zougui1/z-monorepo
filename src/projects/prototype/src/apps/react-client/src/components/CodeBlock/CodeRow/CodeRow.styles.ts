import { makeStyles } from '../../../utils';
import { theme } from '../../../screens/ContextDevTools/theme';

export const styles = makeStyles({
  root: {
    letterSpacing: 0.2,
    overflow: 'hidden',

    '& .linenumber::selection': {
      userSelect: 'none',
      backgroundColor: 'transparent',
    },

    '& span::selection': {
      backgroundColor: '#fff1',
    },

    '&.highlight': {
      backgroundColor: '#fff1',
      borderRadius: 1,

      '&:before': {
        position: 'relative',
        content: '">"',
        color: theme.red,
        overflow: 'hidden',
        // '9.8px' is the width of this element
        // to keep the line number of this element
        // aligned to the other line numbers
        marginRight: '-9.8px'
      },
    },
  },
});
