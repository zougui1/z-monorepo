import { DialogProvider, useDialog } from './dialog';

export function DialogScreen() {
  return (
    <DialogProvider>
      <DialogScreenBody />
    </DialogProvider>
  );
}

function DialogScreenBody() {
  const [openTestDialog] = useDialog({
    title: 'title',
    body: TestDialogBody,
  });

  return (
    <div>
      <button onClick={openTestDialog}>Open dialog</button>
    </div>
  );
}

function TestDialogBody() {
  return (
    <div>
      dialog body
    </div>
  );
}
