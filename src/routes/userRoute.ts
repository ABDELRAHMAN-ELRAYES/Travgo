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
  resetPassword,
} from './../controllers/authControllers';
import { uploadUserPhotoMiddleware } from '../middlewares/middlewares';

const userRouter = Router();

userRouter.post('/login', login);
userRouter.post('/signup', uploadUserPhotoMiddleware, signup);
userRouter.post('/logout', isLoggedIn, logout);
userRouter.post('/change-password', protect,isLoggedIn, changePassword);
userRouter.post('/forget-password', forgetPassword);
userRouter.post('/reset-password',resetPassword);

userRouter.route('/').get(getAllUser).post(createNewUser);
userRouter.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export default userRouter;
