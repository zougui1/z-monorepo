import {
  DialogActions as MuiDialogActions,
  DialogActionsProps as MuiDialogActionsProps,
} from '@mui/material';

import { DialogButton } from '../DialogButton';
import type { DialogData } from '../dialogContext';

export function DialogActions({ buttons, onClose, ...props }: DialogActionsProps) {
  return (
    <MuiDialogActions {...props}>
      {buttons.map(({ Button, key, ...button }) => (
        Button
          ? <Button key={key} onClose={onClose} />
          : <DialogButton {...button} key={button.text || key} onClose={onClose} />
      ))}
    </MuiDialogActions>
  );
}

export interface DialogActionsProps extends Omit<MuiDialogActionsProps, 'children' | 'onClose'> {
  buttons: DialogData['buttons'];
  onClose: (e?: {}) => void;
}
