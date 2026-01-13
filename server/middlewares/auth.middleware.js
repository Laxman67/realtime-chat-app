import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import catchAsyncError from './catchAsyncError.middleware.js';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: getReasonPhrase(StatusCodes.NOT_ACCEPTABLE),
      message: 'User not authenticated , Please sign in ',
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);

  if (!decoded) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: getReasonPhrase(StatusCodes.BAD_REQUEST),
      message: 'token verification failed, please sign in again',
    });
  }

  const user = await User.findById(decoded.id);
  req.user = user;

  next();
});
