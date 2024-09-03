import express from 'express';
import {
  getUser,
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
} from './../controllers/userControllers';
import { login, signup } from './../controllers/authControllers';
const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/signup', signup);

userRouter.route('/').get(getAllUser).post(createNewUser);
userRouter.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export default userRouter;
