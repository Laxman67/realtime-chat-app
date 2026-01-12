import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { signupSchema } from '../validators/auth.validator.js';
import User from '../models/user.model.js';
import { generateJsonWebToken } from '../utils/JWTToken.js';

export const signup = catchAsyncError(async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const { fullName, email, password } = value;

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json({
      success: false,
      error: getReasonPhrase(StatusCodes.NOT_ACCEPTABLE),
      message: 'Email already exists',
    });
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: '',
      url: '',
    },
  });

  await generateJsonWebToken(user, 'User Registered successfully', 201, res);
});
export const signin = catchAsyncError(async (req, res, next) => {});
export const signout = catchAsyncError(async (req, res, next) => {});
export const getUser = catchAsyncError(async (req, res, next) => {});
export const updateProfile = catchAsyncError(async (req, res, next) => {});
