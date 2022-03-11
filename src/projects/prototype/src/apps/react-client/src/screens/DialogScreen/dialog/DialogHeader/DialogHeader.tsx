import {
  DialogHeader as BaseDialogHeader,
  DialogHeaderProps as BaseDialogHeaderProps,
} from '../../../../components/DialogHeader';

import type { DialogData } from '../dialogContext';

export function DialogHeader({ Title, onClose, ...props }: DialogHeaderProps) {
  return (
    <BaseDialogHeader {...props} onClose={onClose}>
      {typeof Title === 'function' ? <Title onClose={onClose} /> : Title}
    </BaseDialogHeader>
  );
}

export interface DialogHeaderProps extends Omit<BaseDialogHeaderProps, 'children' | 'onClose'> {
  Title?: DialogData['title'];
  onClose: (e?: {}) => void;
}
