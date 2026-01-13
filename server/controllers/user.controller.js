import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { signinSchema, signupSchema } from '../validators/auth.validator.js';
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

export const signin = catchAsyncError(async (req, res, next) => {
  const { error, value } = signinSchema.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.details[0].message,
    });
  }
  const { email, password } = value;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json({
      success: false,
      error: getReasonPhrase(StatusCodes.NOT_ACCEPTABLE),
      message: 'Invalid Credentials',
    });
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json({
      success: false,
      error: getReasonPhrase(StatusCodes.NOT_ACCEPTABLE),
      message: 'Invalid Credentials',
    });
  }
  generateJsonWebToken(user, 'User Logged in Successfully', 200, res);
});

export const signout = catchAsyncError(async (req, res, next) => {
  return res
    .status(StatusCodes.OK)
    .cookie('token', '', {
      httpOnly: true,
      maxAge: 0, // hr,min,sec,ms
      samSite: 'strict',
      secure: process.env.NODE_ENV !== 'development' ? true : false,
    })
    .json({
      success: true,
      message: 'User Logged Out Successfully',
    });
});
export const getUser = catchAsyncError(async (req, res, next) => {
  console.log(req.user);

  const user = await User.findById(req.user._id);
  res.status(StatusCodes.OK).json({
    success: true,
    user,
    message: 'User Fetched Successfully',
  });
});
export const updateProfile = catchAsyncError(async (req, res, next) => {});
