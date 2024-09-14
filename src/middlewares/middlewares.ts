import express from 'express';
import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import { iError } from '../interfaces/iError';
import cookieParser from 'cookie-parser';

export const morganMiddleware = morgan('dev');
export const bodyParser = express.json();
export const cookiesParser = cookieParser();

// export const handMadeMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log("Good Request");
//   next();
// };
export const globalErrorHandlerMiddleware = (
  error: iError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.status = error.status || 'Error';
  error.statusCode = error.statusCode || 500;

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    location: error.stack,
  });
};
