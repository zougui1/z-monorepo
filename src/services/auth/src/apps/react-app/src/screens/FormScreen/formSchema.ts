import * as yup from 'yup';

export const formSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(1024).required(),
  myBoolean: yup.boolean(),
  myNumber: yup.number().default(56),
  myEnum: yup.string().oneOf(['City 1', 'City 2', 'City 3', 'City 4']),
  myDate: yup.date().required(),
  myTime: yup.date().required(),
  myDateTime: yup.date().required(),
}).required();

export type FormData = yup.InferType<typeof formSchema>;
