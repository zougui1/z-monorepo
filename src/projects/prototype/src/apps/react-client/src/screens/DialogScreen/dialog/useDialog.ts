import { useEffect } from 'react';

import { useDialogSelector, useDialogActions } from './dialogContext';
import { DialogOptions } from './types';
import { useId } from '../../../hooks';

export const useDialog = (options: DialogOptions): [() => void, () => void, boolean] => {
  const dialogId = useId(options.id);
  const actions = useDialogActions();
  // the dialog is not defined before `useEfffect` gets executed
  const isOpen = useDialogSelector(state => state.dialogs[dialogId]?.isOpen ?? false);

  const dependencyList = options.dependencies || Object.values(options);

  useEffect(() => {
    actions.addDialog({
      ...options,
      id: dialogId,
    });

    return () => {
      actions.removeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, dialogId]);

  useEffect(() => {
    actions.updateDialog({
      ...options,
      id: dialogId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, dialogId, ...dependencyList]);

  const open = () => {
    actions.openDialog(dialogId);
    options.onOpen?.();
  }

  const close = () => {
    actions.closeDialog(dialogId);
    options.onClose?.();
  }

  return [open, close, isOpen];
}
