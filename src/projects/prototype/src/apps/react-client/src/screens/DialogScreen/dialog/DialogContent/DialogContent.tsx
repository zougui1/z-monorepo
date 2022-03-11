import {
  DialogContent as MuiDialogContent,
  DialogContentProps as MuiDialogContentProps,
} from '@mui/material';

import { DialogContentText, DialogContentTextProps } from '../DialogContentText';
import type { DialogData } from '../dialogContext';

export function DialogContent({ Content, Text, TextProps = {}, text, onClose, ...props }: DialogContentProps) {
  return (
    <MuiDialogContent {...props}>
      {typeof Content === 'function' ? <Content onClose={onClose} /> : Content}

      {typeof Text === 'function'
        ? <Text onClose={onClose} />
        : Text
      }
      {text && !Text && (
        <DialogContentText {...TextProps} onClose={onClose} Text={text} />
      )}
    </MuiDialogContent>
  );
}

export interface DialogContentProps extends Omit<MuiDialogContentProps, 'children'> {
  Content: React.ReactNode | DialogData['DialogContent'];
  Text: React.ReactNode | DialogData['DialogContentText'];
  TextProps: Omit<DialogContentTextProps, 'onClose'> | undefined;
  text: React.ReactNode | DialogData['text'];
  onClose: (e?: {}) => void;
}
