import React from 'react';
import { Link, LinkProps } from '@tanstack/react-location';

export const LinkRoot = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  // the span is required as the Link from react-location
  // does not forward the ref
  return (
    <span ref={ref}>
      <Link {...props} />
    </span>
  );
});

export interface LinkRootProps extends LinkProps {

}
