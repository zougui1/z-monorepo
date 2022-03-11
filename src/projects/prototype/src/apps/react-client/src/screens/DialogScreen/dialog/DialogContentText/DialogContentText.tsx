import {
  DialogContentText as MuiDialogContentText,
  DialogContentTextProps as MuiDialogContentTextProps,
} from '@mui/material';

import type { DialogData } from '../dialogContext';

export function DialogContentText({ Text, onClose, ...props }: DialogContentTextProps) {
  return (
    <MuiDialogContentText {...props}>
      {typeof Text === 'function' ? <Text onClose={onClose} /> : Text}
    </MuiDialogContentText>
  );
}

export interface DialogContentTextProps extends Omit<MuiDialogContentTextProps, 'children'> {
  Text?: React.ReactNode | DialogData['text'];
  onClose: (e?: {}) => void;
}
