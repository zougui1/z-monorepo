import {
  DialogTitle,
  DialogTitleProps,
  IconButton,
  IconButtonProps,
  SvgIconProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { styles } from './DialogHeader.styles';
import { mergeSx } from '../../utils';

export const DialogHeader = (props: DialogHeaderProps) => {
  const { children, onClose, IconButtonProps = {}, CloseIconProps = {}, ...DialogTitleProps } = props;

  return (
    <DialogTitle
      {...DialogTitleProps}
      sx={mergeSx(styles.root, DialogTitleProps.sx)}
    >
      {children}

      <IconButton
        {...IconButtonProps}
        sx={mergeSx(styles.closeButton, IconButtonProps.sx)}
        onClick={onClose}
      >
        <CloseIcon {...CloseIconProps} />
      </IconButton>
    </DialogTitle>
  );
}

export interface DialogHeaderProps extends DialogTitleProps {
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  IconButtonProps?: Omit<IconButtonProps, 'onClick'> | undefined;
  CloseIconProps?: SvgIconProps | undefined;
}
