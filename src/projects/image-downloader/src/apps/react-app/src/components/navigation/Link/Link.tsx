import {
  Link as MuiLink,
  LinkProps as MuiLinkProps,
} from '@mui/material';

import { LinkRoot, LinkRootProps } from './LinkRoot';

export const Link = (props: LinkProps) => {
  return (
    <MuiLink
      {...props}
      component={LinkRoot}
    />
  );
}

export interface LinkProps extends MuiLinkProps<'a', LinkRootProps> {

}
