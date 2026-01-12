import jwt from 'jsonwebtoken';

export const generateJsonWebToken = async (user, message, statusCode, res) => {
  // Generate Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return res
    .status(statusCode)
    .cookie('token', token, {
      httpOnly: true,
      maxAge: process.env.COOKIE_EXPIRE,
      samSite: 'strict',
      secure: process.env.NODE_ENV !== 'development' ? true : false,
    })
    .json({
      success: true,
      token,
      message,
    });
};
