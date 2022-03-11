import { useEffect } from 'react'
import { Dialog as MuiDialog } from '@mui/material';

import { DialogHeader } from '../DialogHeader';
import { DialogContent } from '../DialogContent';
import { DialogActions } from '../DialogActions';
import { DialogData } from '../dialogContext';

export function Dialog({ dialog, onClose }: DialogProps) {
  const {
    Dialog: CustomDialog,
    DialogProps,
    DialogHeader: CustomDialogHeader,
    DialogHeaderProps,
    title,
    DialogContent: CustomDialogContent,
    DialogContentProps,
    body,
    DialogContentText: CustomDialogContentText,
    DialogContentTextProps,
    text,
    DialogActions: CustomDialogActions,
    DialogActionsProps,
    buttons,
  } = dialog;

  useEffect(() => console.log('<Dialog />'), [])

  if(CustomDialog) {
    return <CustomDialog isOpen={dialog.isOpen} onClose={onClose} />
  }

  return (
    <MuiDialog {...DialogProps} open={dialog.isOpen} onClose={onClose}>
      {CustomDialogHeader
        ? <CustomDialogHeader onClose={onClose} />
        : <DialogHeader {...DialogHeaderProps} onClose={onClose} Title={title} />
      }

      {CustomDialogContent
        ? <CustomDialogContent onClose={onClose} />
        : (
          <DialogContent
            {...DialogContentProps}
            onClose={onClose}
            Content={body}
            text={text}
            Text={CustomDialogContentText}
            TextProps={DialogContentTextProps}
          />
        )
      }

      {CustomDialogActions
        ? <CustomDialogActions onClose={onClose} />
        : buttons.length > 0 && (
          <DialogActions {...DialogActionsProps} onClose={onClose} buttons={buttons} />
        )
      }
    </MuiDialog>
  );
}

export interface DialogProps {
  dialog: DialogData;
  onClose: (e?: {}) => void;
}
