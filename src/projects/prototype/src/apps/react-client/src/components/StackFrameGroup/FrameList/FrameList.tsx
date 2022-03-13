import { styles } from './FrameList.styles';
import { StackFrame } from '../../StackFrame';
import { ActionStackFrame } from '../../../screens/ContextDevTools/types';

export function FrameList({ frames }: FrameListProps) {
  return (
    <>
      {frames.map(frame => (
        <StackFrame
          key={frame.id}
          fileName={frame.fileName}
          file={frame.fileRelative}
          code={frame.code}
          sx={styles.frame}
        />
      ))}
    </>
  );
}

export interface FrameListProps {
  frames: ActionStackFrame[];
}
