import { makeStyles } from '../../utils';

export const styles = makeStyles({
  root: {
    paddingRight: '46px',
  },

  closeButton: {
    padding: '1px',
    position: 'absolute',
    right: '8px',
    top: '8px',
    color: theme => theme.palette.grey[500],
  },
});
