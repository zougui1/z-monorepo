import { makeStyles } from '../../../utils';
import { theme } from '../../../screens/ContextDevTools/theme';

export const styles = makeStyles({
  root: {
    background: 'unset',
  },

  summary: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff1',
  },

  topSummary: {
    '& .MuiAccordionSummary-expandIconWrapper': {
      transform: 'rotate(-90deg)',
    },

    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(0deg)',
    },
  },

  bottomSummary: {
    '& .MuiAccordionSummary-expandIconWrapper': {
      transform: 'rotate(180deg)',
    },
  },

  details: {
    marginLeft: 1,
    borderLeft: `solid 1px ${theme.blue}`,
  },
});
