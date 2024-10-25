import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import User from './../models/userModel';
import { ErrorHandler } from '../utils/error';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Tour from '../models/tourModel';
import { sendMail, transporter, options } from './../utils/email';
import { googleProfile } from '../interfaces/googleProfile';
import { userDoc } from '../interfaces/userDoc';
import { title } from 'process';

const createToken = async (res: Response, id: string) => {
  const token = await jwt.sign({ id }, <string>process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRES_IN as any) * 24 * 60 * 60 * 1000
    ),
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
    if (!email || !password) {
      // return next(
      //   new ErrorHandler(
      //     'There is no entered data ,please fill all fields',
      //     404
      //   )
      // );
      return res.render('login', {
        title: 'Login',
        message: 'There is no entered data ,please fill all fields',
      });
    }

    // 2) check if email is found or not
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // return next(
      //   new ErrorHandler('Email or password is not correct, Try Again', 401)
      // );
      return res.render('login', {
        title: 'Login',
        message: 'Email or password is not correct, Try Again',
      });
    }
    // 3) check if the password is correct for thsi user
    const isVerifiedPassword = await user.verifyPassword(
      password,
      user.password
    );
    if (!isVerifiedPassword) {
      // return next(
      //   new ErrorHandler('Email or password is not correct, Try Again', 401)
      // );
      return res.render('login', {
        title: 'Login',
        message: 'Email or password is not correct, Try Again',
      });
    }

    // 4) create a session for this user (create a token)
    const token = await createToken(res, user._id.toString());

    const tours = await Tour.find().limit(3);
    res.status(200).render('home', {
      title: 'Home',
      tours,
      user,
    });
  }
);
export const loginWithGoogle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the email from google response
    const email = (req.user as googleProfile)?.emails[0].value;

    // get user using received google email
    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new ErrorHandler('Email or password is not correct, Try Again', 401)
      );
    }

    //  create a session for this user (create a token)
    const token = await createToken(res, user._id.toString());

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
    const user :userDoc = currentUser;
    req.user = user;

    next();
  }
);
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req.user as userDoc).role)) {
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
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.redirect('/');
  }
);

export const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) check if the password is correct for the current user

    const currentUser = await User.findById((req.user as userDoc)._id).select(
      '+password'
    );
    if (!currentUser) {
      return next(new ErrorHandler('User is not found!!.', 400));
    }

    const isVerifiedPassword = await currentUser?.verifyPassword(
      req.body.password,
      currentUser.password
    );

    if (!isVerifiedPassword) {
      // return next(new ErrorHandler('Your Password is not correct!.', 400));
      return res.render('profile', {
        title: 'Profile',
        message: 'Password is not correct..!',
      });
    }
    // 2) update the user password using the new password

    currentUser.password = req.body.newPassword;
    currentUser.passwordConfirm = req.body.confirmNewPassword;
    currentUser.passwordChangedAt = new Date(Date.now());
    await currentUser.save();
    // 3) create new token for user (new login session)
    const token = await createToken(res, `${currentUser?._id}`.toString());

    //4) redirect the user to profile again
    res.redirect('/profile');
  }
);
//send mail for the user by its email
export const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the user by its email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ErrorHandler('User with entered email is not found!.', 401)
      );
    }
    // create a random hashed token to verify user by it
    const token = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //form the options of the email
    options.to = user.email;
    options.text = `use this url to reset your password http://127.0.0.1:3000/reset-password/:${token} , Please make sure to never share this link with any one ,You have only 10 minutes to reset your password..!`;
    options.html = `<p>use this url to reset your password <a="http://127.0.0.1:3000/reset-password/:${token}">http://127.0.0.1:3000/reset-password/:${token}</a> , Please make sure to never share this link with any one ,You have only 10 minutes to reset your password..!</p>`;

    // send email to the user gmail
    await sendMail(transporter, options);

    res.render('checkEmail', {
      title: 'Email Sent',
    });
  }
);
// reset the user forgotten password
export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the hashed user from the form
    const token = req.body.token;

    // get the user by the hashed token
    const user = await User.findOne({ passwordResetToken: token });
    if (!user) {
      return next(
        new ErrorHandler('This Reset Password Token is not correct!1', 400)
      );
    }
    // reset the user password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // redirect user to login using his new password
    res.redirect('/login');
  }
);
