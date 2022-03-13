import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { SxProps } from '@mui/material';

import { styles } from './CollapsedFrameList.styles';
import { FrameList } from '../FrameList';
import { ActionStackFrame } from '../../../screens/ContextDevTools/types';
import { mergeSx } from '../../../utils';

export function CollapsedFrameList({ frames, sx, type, ...rest }: CollapsedFrameListProps) {
  const [expanded, setExpanded] = useState(false);

  const label = `${frames.length} frames are ${expanded ? 'expanded' : 'collapsed'} (${type})`;

  return (
    <Accordion
      {...rest}
      sx={mergeSx(styles.root, sx)}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      disableGutters
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="stack-frame-list-content"
        sx={[styles.summary, styles.topSummary]}
      >
        <Typography variant="caption">{label}</Typography>
      </AccordionSummary>

      <AccordionDetails sx={styles.details}>
        <FrameList frames={frames} />
      </AccordionDetails>

      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="stack-frame-list-content"
        sx={[styles.summary, styles.bottomSummary]}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="caption">{label}</Typography>
      </AccordionSummary>
    </Accordion>
  );
}

export interface CollapsedFrameListProps {
  frames: ActionStackFrame[];
  type: string;
  style?: React.CSSProperties | undefined;
  sx?: SxProps | undefined;
  className?: string | undefined;
}
