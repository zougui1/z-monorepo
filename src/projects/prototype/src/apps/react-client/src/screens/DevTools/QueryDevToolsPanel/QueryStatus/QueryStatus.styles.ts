import { makeSx } from '../utils';

export const styles = makeSx({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '.2em .4em',
    fontWeight: 'bold',
    textShadow: '0 0 10px black',
    borderRadius: '.2em',
    marginRight: 1,
    opacity: 0.3,

    hasQueries: {
      opacity: 1,
    },
  },
});
