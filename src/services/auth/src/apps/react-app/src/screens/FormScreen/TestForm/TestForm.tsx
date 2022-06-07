import { Button, Stack, Grid } from '@mui/material';

import { Form } from '@zougui/common.react-form';

import { Link } from '~/components/navigation/Link';

import { formSchema, FormData } from '../formSchema';

console.log(formSchema.describe())

export const TestForm = () => {
  const defaultValues: Partial<FormData> = {
    myDateTime: new Date(),
  };

  const onSubmit = async (data: FormData) => {
    console.debug('submit', data);
  }

  return (
    <Form schema={formSchema} onSubmit={onSubmit} defaultValues={defaultValues}>
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

        <Form.Field
          label="MyBoolean"
          name="myBoolean"
        />

        <Form.Field
          label="MyNumber"
          name="myNumber"
        />

        <Form.Field
          label="MyEnum"
          name="myEnum"
        />

        <Form.Field
          label="MyDate"
          name="myDate"
          pickerVariant="date"
        />

        <Form.Field
          label="MyTime"
          name="myTime"
          pickerVariant="time"
        />

        <Form.Field
          label="MyDateTime"
          name="myDateTime"
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
