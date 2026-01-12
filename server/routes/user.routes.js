import express from 'express';
import {
  getUser,
  signin,
  signout,
  signup,
  updateProfile,
} from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.post('/sign-in', signup);
userRoutes.post('/sign-up', signin);
userRoutes.get('/sign-out', signout);
userRoutes.get('/me', getUser);
userRoutes.put('/update-profile', updateProfile);

export default userRoutes;
