import { makeStyles } from '~/utils';

export const styles = makeStyles({
  button: {
    textTransform: 'unset',
  },

  wipLabel: {
    textAlign: 'center',
    color: theme => theme.palette.error.main,
    marginTop: '-10px'
  },
});
