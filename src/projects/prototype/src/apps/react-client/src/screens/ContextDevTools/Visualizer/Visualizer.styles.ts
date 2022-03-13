import { makeStyles } from '../../../utils';

export const styles = makeStyles({
  tabs: {
    '& .tab': {
      paddingX: 1,
    },
  },

  tabPanel: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%',
    width: '100%',
    overflow: 'auto',
  },

  tabContent: {
    width: '100%',
  },

  collaspedStackFrameGroup: {
    marginBottom: 3,
  },
});
