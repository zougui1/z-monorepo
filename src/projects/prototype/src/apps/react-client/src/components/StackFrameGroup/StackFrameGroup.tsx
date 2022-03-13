import type { SxProps } from '@mui/material';

import { FrameList } from './FrameList';
import { CollapsedFrameList } from './CollapsedFrameList';
import { ActionStackFrame } from '../../screens/ContextDevTools/types';

export function StackFrameGroup({ collapse, ...rest }: StackFrameGroupProps) {
  return (
    <>
      {collapse
        ? <CollapsedFrameList {...rest} />
        : <FrameList {...rest} />
      }
    </>
  );
}

export interface StackFrameGroupProps {
  frames: ActionStackFrame[];
  type: string;
  collapse?: boolean;
  style?: React.CSSProperties | undefined;
  sx?: SxProps | undefined;
  className?: string | undefined;
}
