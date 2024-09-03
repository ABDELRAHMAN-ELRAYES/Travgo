import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from './../models/userModel';
import { ErrorHandler } from '../utils/error';
import jwt from 'jsonwebtoken';

const createUserToken = async (id: string) => {
  return await jwt.sign({ id }, <string>process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //check if the email and password are entered
    console.log(req.body);
    const { password, email } = req.body;
    if (!password || !email) {
      return next(new ErrorHandler('Your must enter password and email', 404));
    }
    // check if the user with entered email found
    const user = await User.findOne({ email: email });
    if (!user) {
      return next(new ErrorHandler('user with entered data not found', 404));
    }
    // validate the password with the found email}
    const isValidPassword = await user.verifyPassword(password, user.password);
    // create the user jwt
    res.status(200).json({
      status: 'success',
    });
  }
);
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //check if the email and password are entered
    const { password, email } = req.body;
    if (!password || !email) {
      return next(new ErrorHandler('Your must enter password and email', 404));
    }
    // check if the user with entered email found
    const user = await User.findOne({ email: req.body.email }).select(
      '+password'
    );
    if (!user) {
      return next(new ErrorHandler('user with entered data not found', 404));
    }
    // validate the password with the found email}
    const isValidPassword = await user.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return next(
        new ErrorHandler('The password or email is not correct.', 401)
      );
    }
    console.log((user._id).toString());
    // create the user jwt
    const token = await createUserToken((user._id).toString());

    res.status(200).json({
      status: 'success',
      token,
    });
  }
);
