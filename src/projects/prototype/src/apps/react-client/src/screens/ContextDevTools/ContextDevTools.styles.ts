import { theme } from './theme';
import { makeStyles } from '../../utils';

export const styles = makeStyles({
  root: {
    backgroundColor: theme.primaryBackground,
    height: '100vh',
    width: 600,
  },

  tabPanel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  mainSection: {
    display: 'flex',
    height: '80%',
  },

  actionsSubSection: {
    backgroundColor: theme.secondaryBackground,
    width: '40%',
  },

  contextsSubSection: {
    backgroundColor: theme.secondaryBackground,
    borderLeft: `2px double ${theme.primaryBackground}`,
    width: '60%',
  },
});
