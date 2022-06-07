import * as yup from 'yup';

export const loginFormSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(1024).required(),
  test: yup.boolean(),
}).required();

export type LoginFormData = yup.InferType<typeof loginFormSchema>;
