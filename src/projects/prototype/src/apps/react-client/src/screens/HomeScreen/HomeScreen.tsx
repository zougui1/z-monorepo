import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

import { routes } from '../../routes';

export function HomeScreen() {
  return (
    <div>
      {routes.map(route => (
        <Typography color="text.secondary" key={route.path}>
          <Link style={{ color: 'inherit', textDecoration: 'none' }} to={route.path}>{route.name}</Link>
        </Typography>
      ))}
    </div>
  );
}
