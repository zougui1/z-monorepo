import { alpha } from '@mui/material/styles';

import { theme } from '../../../screens/ContextDevTools/theme';
import { makeStyles } from '../../../utils';

export const styles = makeStyles({
  container: {
    display: 'flex',
    color: 'text.primary',
  },

  removed: {
    backgroundColor: alpha(theme.red, 0.55),
    padding: '4px',
    borderRadius: 1,
  },

  added: {
    backgroundColor: alpha(theme.green, 0.55),
    textDecoration: 'none',
    color: 'text.primary',
    padding: '4px',
    borderRadius: 1,
  },
});
