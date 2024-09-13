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
  login,
  signup,
} from './../controllers/authControllers';

const userRouter = Router();

userRouter.post('/login', login);
userRouter.post('/signup', signup);
userRouter.post('/privacy/forget-password', forgetPassword);

userRouter.route('/').get(getAllUser).post(createNewUser);
userRouter.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export default userRouter;
