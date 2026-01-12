// export const signupSchema = z.object({
import Joi from 'joi';

export const signupSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
