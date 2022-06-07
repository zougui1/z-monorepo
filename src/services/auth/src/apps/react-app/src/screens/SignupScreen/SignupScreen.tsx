import { Typography, Grid } from '@mui/material';

import { AuthLayout } from '~/components/layout/AuthLayout';

import { SignupForm } from './SignupForm';

export const SignupScreen = () => {
  return (
    <AuthLayout>
      <Grid container justifyContent="center">
        <Typography variant="h5" gutterBottom>Signup</Typography>
      </Grid>

      <SignupForm />
    </AuthLayout>
  );
}
