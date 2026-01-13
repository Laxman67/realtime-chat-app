import { StatusCodes } from 'http-status-codes';
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  // const user = req.user;
  const filteredUser = await User.find({ _id: { $ne: req.user._id } });
  res.status(StatusCodes.OK).json({
    Id: req.user._id,
    success: true,
    filteredUser,
    messages: 'All User fetched',
  });
});
export const getMessages = catchAsyncError(async (req, res, next) => {
  const receiverId = req.params.id;
  const myId = req.user._id;
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Receiver Id not found' });
  }
  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: receiverId },
      { senderId: receiverId, receiverId: myId },
    ],
  });

  res.status(StatusCodes.OK).json({
    success: true,
    messages,
  });
});
export const sendMessages = catchAsyncError(async (req, res, next) => {
  const { text } = req.body;
  const media = req?.files?.media;
  // we're extracting id as receiverId
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Receiver Id not found' });
  }
  const sanitizedText = text?.trim() || '';

  if (!sanitizedText && !media) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ success: false, message: 'cannot send empty message' });
  }

  let mediaUrl = '';

  if (media) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(
        media.tempFilePath,
        {
          folder: 'CHAT_APP_MEDIA',
          resource_type: 'auto', //Autodetect it could be image or video or voice
          transformation: [
            { width: 1080, height: 1080, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        }
      );
      mediaUrl = uploadResponse?.secure_url;
    } catch (error) {
      logger.error('Cloudinary upload error', error);
      console.log(error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to upload media, Please try again!',
        error: error,
      });
    }
  }
});
