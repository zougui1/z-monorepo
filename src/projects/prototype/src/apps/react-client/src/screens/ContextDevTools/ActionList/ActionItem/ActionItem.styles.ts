import { lighten } from '@mui/material/styles';

import { theme } from '../../theme';
import { makeStyles } from '../../../../utils';

export const styles = makeStyles({
  actionText: {
    color: 'text.primary',

    '& > span': {
      fontSize: 14,
    },
  },

  buttonGroup: {
    backgroundColor: lighten(theme.primaryBackground, 0.01)
  },

  button: {
    fontSize: 12,
    px: 1,
  },

  timestampContainer: {
    backgroundColor: lighten(theme.primaryBackground, 0.01),
    p: 1,
    borderRadius: 1,
  },
});
