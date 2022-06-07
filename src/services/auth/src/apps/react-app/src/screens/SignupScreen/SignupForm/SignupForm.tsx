import { Button, Stack, Grid } from '@mui/material';

import { reactAuthHttp } from '@zougui/auth.react-http/v1';
import { Form } from '@zougui/common.react-form';

import { Link } from '~/components/navigation/Link';

import { signupFormSchema, SignupFormData } from '../signupFormSchema';

export const SignupForm = () => {
  const defaultValues: SignupFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const signup = reactAuthHttp.signup().useMutation({
    onSuccess: ({ data: user }) => console.log('user:', user),
  });

  const onSubmit = async (data: SignupFormData) => {
    console.debug('submit', data);
    signup.mutate({
      ...data,
      userAgent: navigator.userAgent,
    });
  }

  return (
    <Form schema={signupFormSchema} onSubmit={onSubmit} defaultValues={defaultValues}>
      <Stack direction="column" spacing={3}>
        <Form.TextField
          label="Name"
          name="name"
        />

        <Form.TextField
          label="Email"
          name="email"
        />

        <Form.TextField
          label="Password"
          name="password"
          type="password"
        />

        <Form.TextField
          label="Confirm password"
          name="confirmPassword"
          type="password"
        />

        <Grid container justifyContent="space-between">
          <Link to="/login" variant="button">
            Sign in instead
          </Link>

          <Button type="submit" variant="contained">Signup</Button>
        </Grid>
      </Stack>
    </Form>
  );
}
