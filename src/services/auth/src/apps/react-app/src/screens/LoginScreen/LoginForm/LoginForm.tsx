import { Button, Stack, Grid } from '@mui/material';

import { reactAuthHttp } from '@zougui/auth.react-http/v1';
import { Form } from '@zougui/common.react-form';

import { Link } from '~/components/navigation/Link';

import { loginFormSchema, LoginFormData } from '../loginFormSchema';

export const LoginForm = () => {
  const defaultValues: LoginFormData = {
    email: '',
    password: '',
    test: false,
  };
  const login = reactAuthHttp.login().useMutation({
    onSuccess: ({ data: user }) => console.log('user:', user),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.debug('submit', data);
    login.mutate({
      email: data.email,
      password: data.password,
      userAgent: navigator.userAgent,
    });
  }

  return (
    <Form schema={loginFormSchema} onSubmit={onSubmit} defaultValues={defaultValues}>
      <Stack direction="column" spacing={3}>
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
          label="Test"
          name="test"
        />

        <Grid container justifyContent="center">
          <Link to="/forgotten-password" variant="button" wip>
            Forgot password?
          </Link>
        </Grid>

        <Grid container justifyContent="space-between">
          <Link to="/signup" variant="button">
            Create an account
          </Link>

          <Button type="submit" variant="contained">Login</Button>
        </Grid>
      </Stack>
    </Form>
  );
}
