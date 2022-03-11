import type { PayloadAction } from '@reduxjs/toolkit';

import { createSliceContext } from '@zougui/common.react-utils';

import { DialogOptions } from './types';

const defaultButtons: DialogOptions['buttons'] = [
  {
    text: 'Cancel',
    'aria-label': 'Dialog cancel',
  },
  {
    text: 'Ok',
    'aria-label': 'Dialog ok',
  },
];

export interface DialogData {
  id: string;
  isOpen: boolean;
  Dialog?: DialogOptions['Dialog'];
  DialogProps?: DialogOptions['DialogProps'];
  DialogHeader?: DialogOptions['DialogHeader'];
  DialogHeaderProps?: DialogOptions['DialogHeaderProps'];
  DialogContent?: DialogOptions['DialogContent'];
  DialogContentProps?: DialogOptions['DialogContentProps'];
  DialogContentText?: DialogOptions['DialogContentText'];
  DialogContentTextProps?: DialogOptions['DialogContentTextProps'];
  DialogActions?: DialogOptions['DialogActions'];
  DialogActionsProps?: DialogOptions['DialogActionsProps'];
  body?: DialogOptions['body'];
  text?: DialogOptions['text'];
  title?: DialogOptions['title'];
  onClose?: DialogOptions['onClose'];
  keepMounted?: DialogOptions['keepMounted'];
  buttons: NonNullable<DialogOptions['buttons']>;
}

export interface DialogState {
  dialogs: Record<string, DialogData>;
}

export const initialState: DialogState = {
  dialogs: {},
};

const context = createSliceContext({
  name: 'DialogContext',
  initialState,
  reducers: {
    addDialog: (state, action: PayloadAction<{ id: string } & DialogOptions>) => {
      const {
        id,
        defaultIsOpen,
        buttons,
        isOpen,
        keepMounted,
      } = action.payload;

      if (state.dialogs[id]) {
        console.warn(`A dialog with id "${id}" already exists.`);
        return;
      }

      state.dialogs[id] = {
        ...action.payload,
        // the typescript compiler complains about the type `ButtonProps`
        // used along with the types used by the library 'immer'
        buttons: (buttons || defaultButtons) as any[],
        isOpen: isOpen ?? defaultIsOpen ?? false,
        keepMounted: keepMounted ?? true,
      } as any;
    },

    updateDialog: (state, action: PayloadAction<{ id: string } & Partial<DialogOptions>>) => {
      const {
        id,
        defaultIsOpen,
        buttons,
        isOpen,
        keepMounted,
      } = action.payload;
      const dialog = state.dialogs[id];

      if(!dialog) {
        return;
      }

      state.dialogs[id] = {
        ...dialog,
        ...action.payload,
        // the typescript compiler complains about the type `ButtonProps`
        // used along with the types used by the library 'immer'
        buttons: (buttons || defaultButtons) as any[],
        isOpen: isOpen ?? defaultIsOpen ?? false,
        keepMounted: keepMounted ?? true,
      } as any;
    },

    removeDialog: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.dialogs[id];
    },

    openDialog: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const dialog = state.dialogs[id];

      if (dialog) {
        dialog.isOpen = true;
      }
    },

    closeDialog: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const dialog = state.dialogs[id];

      if (dialog) {
        dialog.isOpen = false;
      }
    },
  },
});

export const {
  useSelector: useDialogSelector,
  useActions: useDialogActions,
  Provider: DialogContextProvider,
} = context;
