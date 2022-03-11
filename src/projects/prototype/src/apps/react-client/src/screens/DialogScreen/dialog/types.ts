import type {
  DialogProps,
  DialogContentProps,
  DialogContentTextProps,
  DialogActionsProps,
  ButtonProps,
} from '@mui/material';

import type { DialogHeaderProps } from './DialogHeader';

export interface DialogOptions {
  Dialog?: ((props: { isOpen: boolean; onClose: ((e?: {}) => void) }) => JSX.Element) | undefined;
  DialogProps?: DialogProps | undefined;
  DialogHeader?: ((props: { onClose: ((e?: {}) => void) }) => JSX.Element) | undefined;
  DialogHeaderProps?: DialogHeaderProps | undefined;
  DialogContent?: ((props: { onClose: ((e?: {}) => void) }) => JSX.Element) | undefined;
  DialogContentProps?: DialogContentProps | undefined;
  DialogContentText?: ((props: { onClose: ((e?: {}) => void) }) => JSX.Element) | undefined;
  DialogContentTextProps?: DialogContentTextProps | undefined;
  DialogActions?: ((props: { onClose: ((e?: {}) => void) }) => JSX.Element) | undefined;
  DialogActionsProps?: DialogActionsProps | undefined;
  id?: string | undefined;
  /**
   * @default false
   */
  isOpen?: boolean | undefined;
  /**
   * @default false
   */
  defaultIsOpen?: boolean | undefined;
  /**
   * @default false
   */
  keepMounted?: boolean | undefined;
  body?: ((props: { onClose: ((e?: {}) => void) }) => JSX.Element) | undefined;
  text?: React.ReactNode | ((props: { onClose: ((e?: {}) => void) }) => JSX.Element);
  title?: React.ReactNode | ((props: { onClose: ((e?: {}) => void) }) => JSX.Element);
  props?: Record<string, any> | undefined;
  buttons?: DialogButton[] | undefined;
  onClose?: ((e?: {}) => void) | undefined;
  onOpen?: (() => void) | undefined;
  dependencies?: React.DependencyList | undefined;
}

export type DialogButton = DialogChildrenButton | DialogTextButton | DialogCustomButton;

export type DialogCustomButton = {
  Button: (props: { onClose: (e?: {}) => void }) => JSX.Element;
  text?: null | undefined;
  key: React.ReactText;
};

export interface DialogChildrenButton extends ButtonProps {
  /**
   * @default true
   */
  closeOnClick?: boolean;
  Button?: null | undefined;
  text?: null | undefined;
  key: React.Key;
}

export interface DialogTextButton extends ButtonProps {
  /**
   * @default true
   */
  closeOnClick?: boolean;
  Button?: null | undefined;
  text: React.ReactText;
  key?: null;
}
