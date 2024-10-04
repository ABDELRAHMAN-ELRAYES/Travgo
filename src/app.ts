import express, { Request, Response, NextFunction } from 'express';
import {
  morganMiddleware,
  bodyParser,
  globalErrorHandlerMiddleware,
  cookiesParser,
  urlEndcoded,
  passportInitializeMiddleware,
} from './middlewares/middlewares';
import tourRouter from './routes/toursRoute';
import userRouter from './routes/userRoute';
import viewRouter from './routes/viewRoutes';
import reviewRouter from './routes/reviews';
import { ErrorHandler } from './utils/error';
import path from 'path';
import bookingRouter from './routes/bookingRoutes';
import cors from 'cors';
import googleRouter from './routes/googleOAuthRoutes';
import { renderErrorPage } from './controllers/viewControllers';
import { isLoggedIn } from './controllers/authControllers';

const app = express();

// middlewares
app.use(morganMiddleware);
app.use(urlEndcoded);
app.use(bodyParser);
app.use(cookiesParser);
app.use(passportInitializeMiddleware);

const url = `http://localhost:3000`;
app.use(cors({ origin: url }));

// setup the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// setup the static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

// all routers
app.use('/', viewRouter);
app.use('/users', userRouter);
app.use('/tours', tourRouter);
app.use('/reviews', reviewRouter);
app.use('/bookings', bookingRouter);
app.use('/auth/google', googleRouter);

// the alternative if all routes not found
/* app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorHandler(
    `This URL provided ${req.originalUrl} is not  found`,
    404
  );
  next(error);
}); */

app.all('*', isLoggedIn, renderErrorPage);

// catch errors globally
app.use(globalErrorHandlerMiddleware);

export default app;
