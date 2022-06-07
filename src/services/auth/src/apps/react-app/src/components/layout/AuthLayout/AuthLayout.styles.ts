import { makeStyles } from '~/utils';

const headerSize = '64px';

export const styles = makeStyles({
  root: {
    display: 'flex',
    height: `calc(100vh - ${headerSize})`,
  },

  container: {
    margin: 'auto',
  },

  paper: {
    padding: 4,
  },
});
