import {
  Link as MuiLink,
  LinkProps as MuiLinkProps,
  Button,
  Typography,
} from '@mui/material';

import { styles } from './Link.styles';
import { LinkRoot, LinkRootProps } from './LinkRoot';

export const Link = ({ variant, disabled, children, wip, ...rest }: LinkProps) => {
  const isButtonVariant = variant === 'button';
  const isDisabled = disabled || wip;


  return (
    <span style={{ display: 'flex', flexDirection: 'column' }}>
      <MuiLink
        {...rest}
        component={LinkRoot}
        variant={isButtonVariant ? undefined : variant}
        disabled={isDisabled}
      >
        {isButtonVariant
          ? <Button sx={styles.button} disabled={isDisabled}>{children}</Button>
          : children
        }
      </MuiLink>

      {wip && <Typography variant="caption" sx={styles.wipLabel}>Work in progress</Typography>}
    </span>
  );
}

export interface LinkProps extends MuiLinkProps<'a', LinkRootProps> {
  /**
   * displays to the user if the effect of the link is still a work in progress
   */
  wip?: boolean | undefined;
}
