import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from './../models/userModel';
import { ErrorHandler } from '../utils/error';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Tour from '../models/tourModel';
import { sendMail, transporter, options } from './../utils/email';
import { title } from 'process';

/* 

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
 */

const createToken = async (res: Response, id: string) => {
  const token = await jwt.sign({ id }, <string>process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie('jwt', token, {
    expires:
    new Date(Date.now() + (process.env.COOKIE_EXPIRES_IN as any * 24 * 60 *60* 1000)),
    httpOnly: true,
  });
  return token;
};

// controller of signup
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) check if there is entered data or not
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorHandler(
          'There is no entered data ,please fill all fields',
          404
        )
      );
    }
    // 2) check if there is  a user with entered email

    const user = await User.find({ email });
    if (user.length) {
      return next(new ErrorHandler('This email is already registered', 401));
    }
    req.body.photo = req.file?.filename;
    const newUser = await User.create(req.body);

    // 4) create a session for this user (create a token)

    const token = await createToken(res, newUser._id.toString());
    // 5) redirect the user to home page after signup
    res.redirect('/');
  }
);
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) check all required data is entered
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return next(
        new ErrorHandler(
          'There is no entered data ,please fill all fields',
          404
        )
      );
    }

    // 2) check if email is found or not
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(
        new ErrorHandler('Email or password is not correct, Try Again', 401)
      );
    }
    // 3) check if the password is correct for thsi user
    const isVerifiedPassword = await user.verifyPassword(
      password,
      user.password
    );
    if (!isVerifiedPassword) {
      return next(
        new ErrorHandler('Email or password is not correct, Try Again', 401)
      );
    }

    // 4) create a session for this user (create a token)
    const token = await createToken(res, user._id.toString());

    // res.status(200).json({
    //   status: 'success',
    //   message: 'You are signed in successfully',
    //   token,
    // });

    const tours = await Tour.find().limit(3);
    res.status(200).render('home', {
      title: 'Home',
      tours,
      user,
    });
  }
);
const verifyToken = promisify(
  (
    token: string,
    secret: string,
    callback: (error: any, decoded: any) => void
  ) => {
    return jwt.verify(token, secret, callback);
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) check if there is a token
    if (!req.cookies.jwt) {
      return next(
        new ErrorHandler('You are not login ,Login and Try Again', 401)
      );
    }
    const token = req.cookies.jwt;

    // 2) verify current token
    const decoded = await verifyToken(token, <string>process.env.JWT_SECRET);

    if (!decoded) {
      return next(new ErrorHandler('This token is not correct!.', 401));
    }
    // 3) extract user id from the token to get the current user

    const currentUser = await User.findById(decoded.id);

    // 4) Check if the user is still exist (not deleted)
    if (!currentUser) {
      return next(
        new ErrorHandler('User with the current token is nolonger found!.', 401)
      );
    }
    // 5) check if the password is changed
    const isPasswordReset = currentUser.checkPasswordReset(decoded.iat);
    if (isPasswordReset) {
      return next(
        new ErrorHandler(
          'The password is changed ,session time out,plz login again',
          401
        )
      );
    }
    // 6) add  current user data to the request
    req.user = currentUser;

    next();
  }
);
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          'You do not have permission to perform this action',
          403
        )
      );
    }

    next();
  };
};

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      // 2) verify current token
      const decoded = await verifyToken(token, <string>process.env.JWT_SECRET);

      if (!decoded) {
        return next();
      }
      // 3) extract user id from the token to get the current user

      const currentUser = await User.findById(decoded.id);

      // 4) Check if the user is still exist (not deleted)
      if (!currentUser) {
        return next();
      }
      // 5) check if the password is changed
      const isPasswordReset = currentUser.checkPasswordReset(decoded.iat);
      if (isPasswordReset) {
        return next();
      }
      // 6) add  current user data to the response
      res.locals.user = currentUser;
    } catch (error) {
      return next();
    }
  }
  next();
};
export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('jwt', 'loggedout', {
      expires:
      new Date(Date.now() + (10 * 1000)),
      httpOnly: true,
    });
    res.redirect('/');
  }
);

export const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
