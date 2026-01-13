import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import {
  signinSchema,
  signupSchema,
  updateSchema,
} from '../validators/auth.validator.js';
import User from '../models/user.model.js';
import { generateJsonWebToken } from '../utils/JWTToken.js';
import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';

export const signup = catchAsyncError(async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
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
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { error, value } = updateSchema.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.details[0].message,
    });
  }

  // Implementation for avatar feature
  const avatar = req?.files?.avatar;

  let cloudinaryResponse = {};

  if (avatar) {
    try {
      // Firstly delete the existing one
      const oldAvatarPublicId = req.user.avatar.public_id;

      if (
        oldAvatarPublicId &&
        oldAvatarPublicId !== '' &&
        oldAvatarPublicId.length > 0
      ) {
        const deleteResult = await cloudinary.uploader.destroy(
          oldAvatarPublicId
        );
        logger.info(deleteResult);
      }

      // Now update  cloudinaryResponse with new url string and public id
      /**
         *
         *  fileUpload({
             useTempFiles: true,
             tempFileDir: './temp/',
           })
         *  file with avatar field
         */
      cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: 'CHAT_APP_USERS_AVATARS',
          resource_type: '',
          transformation: [
            { width: 300, height: 300, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        }
      );

      logger.info(cloudinaryResponse);
    } catch (error) {
      logger.error('Cloudinary upload error', error);
      console.log(error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to upload avatar, Please try again!',
        error: error,
      });
    }
  }

  // Let create data object to update
  let dataToUpdate = {
    fullName: value.fullName,
    email: value.email,
  };

  if (
    avatar &&
    cloudinaryResponse?.public_id &&
    cloudinaryResponse?.secure_url
  ) {
    dataToUpdate.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user._id, dataToUpdate, {
    runValidators: true,
    new: true,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, user, message: 'User Updated Successfully' });
});
