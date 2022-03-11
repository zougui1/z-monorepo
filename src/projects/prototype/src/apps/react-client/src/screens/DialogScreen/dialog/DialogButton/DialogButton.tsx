import { Button } from '@mui/material';

import type { DialogChildrenButton, DialogTextButton } from '../types';

export function DialogButton({ closeOnClick, onClose, onClick, text, children, ...props }: DialogButtonProps) {
  return (
    <Button
      {...props}
      onClick={e => {
        if (closeOnClick ?? true) {
          onClose(e);
        }

        onClick?.(e);
      }}
    >
      {text || children}
    </Button>
  );
}

export interface DialogButtonProps extends Omit<DialogChildrenButton, 'key' | 'text'>, Omit<DialogTextButton, 'key' | 'text'> {
  text?: React.ReactText | null;
  onClose: (e?: {}) => void;
}
