import { Router } from 'express';
import {
  getUser,
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
} from './../controllers/userControllers';
import {
  forgetPassword,
  isLoggedIn,
  login,
  logout,
  protect,
  changePassword,
  signup,
} from './../controllers/authControllers';
import { uploadUserPhotoMiddleware } from '../middlewares/middlewares';

const userRouter = Router();

userRouter.post('/signup', uploadUserPhotoMiddleware, signup);
userRouter.post('/login', login);
userRouter.post('/logout', isLoggedIn, logout);
userRouter.post('/reset-password', protect, changePassword);

userRouter.route('/').get(getAllUser).post(createNewUser);
userRouter.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export default userRouter;
