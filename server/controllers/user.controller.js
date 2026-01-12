import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { signupSchema } from '../validators/auth.validator.js';
import User from '../models/user.model.js';

export const signup = catchAsyncError(async (req, res, next) => {
  const { fullName, email, password } = signupSchema(req.body);

  if (!fullName || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: getReasonPhrase(StatusCodes.BAD_GATEWAY),
      message: 'Please Provide complete details',
    });
  }

  const emailExists = await User.findOne({ email });
});
export const signin = catchAsyncError(async (req, res, next) => {});
export const signout = catchAsyncError(async (req, res, next) => {});
export const getUser = catchAsyncError(async (req, res, next) => {});
export const updateProfile = catchAsyncError(async (req, res, next) => {});
