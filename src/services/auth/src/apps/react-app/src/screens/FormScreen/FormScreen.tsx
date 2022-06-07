import { Typography, Grid } from '@mui/material';

import { AuthLayout } from '~/components/layout/AuthLayout';

import { TestForm } from './TestForm';

export const FormScreen = () => {
  return (
    <AuthLayout>
      <Grid container justifyContent="center">
        <Typography variant="h5" gutterBottom>Form</Typography>
      </Grid>

      <TestForm />
    </AuthLayout>
  );
}
