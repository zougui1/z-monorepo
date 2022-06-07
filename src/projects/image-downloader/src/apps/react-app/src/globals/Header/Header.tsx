import { AppBar, Toolbar } from '@mui/material';

import { Link } from '~/components/navigation/Link';

export const Header = () => {
  return (
    <AppBar>
      <Toolbar>
        <Link to="/gallery">Gallery</Link>
      </Toolbar>
    </AppBar>
  );
}
