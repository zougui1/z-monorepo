import { Typography, Grid } from '@mui/material';

import { AuthLayout } from '~/components/layout/AuthLayout';

import { LoginForm } from './LoginForm';

export const LoginScreen = () => {
  return (
    <AuthLayout>
      <Grid container justifyContent="center">
        <Typography variant="h5" gutterBottom>Login</Typography>
      </Grid>

      <LoginForm />
    </AuthLayout>
  );
}
