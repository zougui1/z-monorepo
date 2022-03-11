import { DialogContextProvider } from './dialogContext';
import { RenderDialogs } from './RenderDialogs';

export function DialogProvider({ children }: DialogProviderProps) {
  return (
    <DialogContextProvider>
      {children}
      <RenderDialogs />
    </DialogContextProvider>
  );
}

export interface DialogProviderProps {
  children?: React.ReactNode;
}
