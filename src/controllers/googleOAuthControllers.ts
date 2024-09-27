import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';

export const successGoogleAuthorization = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    res.redirect('/');
  }
);
