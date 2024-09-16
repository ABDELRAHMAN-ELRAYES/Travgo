import express from 'express';
import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import { iError } from '../interfaces/iError';
import cookieParser from 'cookie-parser';
import multer from 'multer';

export const morganMiddleware = morgan('dev');
export const bodyParser = express.json();
export const urlEndcoded = express.urlencoded({ extended: true });
export const cookiesParser = cookieParser();

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
