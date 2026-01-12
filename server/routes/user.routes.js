import express from 'express';
import {
  getUser,
  signin,
  signout,
  signup,
  updateProfile,
} from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.post('/sign-up', signup);
userRoutes.post('/sign-in', signin);
userRoutes.get('/sign-out', signout);
userRoutes.get('/me', getUser);
userRoutes.put('/update-profile', updateProfile);

export default userRoutes;
