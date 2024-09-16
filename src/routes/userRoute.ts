import { Router } from 'express';
import {
  getUser,
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
  uploadUserPhotoMiddleware,
} from './../controllers/userControllers';
import {
  forgetPassword,
  login,
  signup,
} from './../controllers/authControllers';

const userRouter = Router();

userRouter.post('/signup', uploadUserPhotoMiddleware, signup);
userRouter.post('/login', login);
userRouter.post('/privacy/forget-password', forgetPassword);

userRouter.route('/').get(getAllUser).post(createNewUser);
userRouter.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export default userRouter;
