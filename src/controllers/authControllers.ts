import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from './../models/userModel';
import { ErrorHandler } from '../utils/error';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { sendMail, transporter, options } from './../utils/email';

const createUserToken = async (id: string) => {
  return await jwt.sign({ id }, <string>process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      role: req.body.role,
      active: req.body.active,
      passwordConfirm: req.body.passwordConfirm,
    });
    const token = await createUserToken(user._id.toString());

    res.status(200).json({
      status: 'success',
      token,
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
    console.log(user._id.toString());
    // create the user jwt
    const token = await createUserToken(user._id.toString());

    res.status(200).json({
      status: 'success',
      token,
    });
  }
);
const checkValidateToken = promisify(
  (
    token: string,
    secretKey: string,
    callback: (err: any, decoded: any) => void
  ) => {
    return jwt.verify(token, secretKey, callback);
  }
);
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1-extract token

    if (!req.headers.authorization?.startsWith('Bearer')) {
      return next(new ErrorHandler('The authorization token is wrong!.', 401));
    }
    const token = req.headers.authorization?.split(' ')[1];
    // 2- verify token

    const decoded = await checkValidateToken(
      token,
      <string>process.env.JWT_SECRET
    );
    // 3-check the user still exits
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new ErrorHandler('User with the current token is nolonger found!.', 401)
      );
    }

    // 4-check if the password changed after token
    const isPasswordReset = user.checkPasswordReset(decoded.iat);
    if (isPasswordReset) {
      return next(
        new ErrorHandler(
          'The password is changed ,session time out,plz login again',
          401
        )
      );
    }

    req.user = user;
    next();
  }
);
export const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ErrorHandler('User with entered email is not found!.', 401)
      );
    }

    const token = user.createResetPasswordToken();

    // await user.save({validateBeforeSave:false});
    await sendMail(transporter, options);

    res.status(200).json({
      status: 'success',
    });
  }
);
