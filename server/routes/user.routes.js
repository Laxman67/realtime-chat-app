import express from 'express';
import {
  getUser,
  signin,
  signout,
  signup,
  updateProfile,
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const userRoutes = express.Router();

userRoutes.post('/sign-up', signup);
userRoutes.post('/sign-in', signin);
userRoutes.get('/sign-out', isAuthenticated, signout);
userRoutes.get('/me', isAuthenticated, getUser);
userRoutes.put('/update-profile', isAuthenticated, updateProfile);

export default userRoutes;
