import * as yup from 'yup';

export const signupFormSchema = yup.object({
  name: yup.string().min(3).max(32).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).max(1024).required(),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required(),
}).required();

export type SignupFormData = yup.InferType<typeof signupFormSchema>;
