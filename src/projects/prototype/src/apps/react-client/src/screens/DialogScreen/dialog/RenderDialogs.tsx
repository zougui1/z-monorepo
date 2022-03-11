import { Dialog } from './Dialog';
import { useDialogSelector, useDialogActions } from './dialogContext';

export function RenderDialogs() {
  const dialogs = useDialogSelector(state => state.dialogs);
  const actions = useDialogActions();

  const dialogsToMount = Object
    .values(dialogs)
    .filter(dialog => dialog.keepMounted || dialog.isOpen);

  return (
    <>
      {dialogsToMount.map(dialog => (
        <Dialog
          key={dialog.id}
          dialog={dialog}
          onClose={() => actions.closeDialog(dialog.id)}
        />
      ))}
    </>
  );
}
