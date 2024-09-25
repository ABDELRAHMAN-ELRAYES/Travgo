import express, { Request, Response, NextFunction } from 'express';
import {
  morganMiddleware,
  bodyParser,
  globalErrorHandlerMiddleware,
  cookiesParser,
  urlEndcoded,
} from './middlewares/middlewares';
import tourRouter from './routes/toursRoute';
import userRouter from './routes/userRoute';
import viewRouter from './routes/viewRoutes';
import reviewRouter from './routes/reviews';
import { ErrorHandler } from './utils/error';
import path from 'path';
import bookingRouter from './routes/bookingRoutes';
import cors from 'cors';

const app = express();

// middlewares
app.use(morganMiddleware);
app.use(urlEndcoded);
app.use(bodyParser);
app.use(cookiesParser);

const url = `http://localhost:3000`;
app.use(cors({ origin: url }));

// setup the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// setup the static files
app.use(express.static(path.join(__dirname, 'public')));

// all routers
app.use('/', viewRouter);
app.use('/users', userRouter);
app.use('/tours', tourRouter);
app.use('/reviews', reviewRouter);
app.use('/bookings', bookingRouter);

// the alternative if all routes not found
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorHandler(
    `This URL provided ${req.originalUrl} is not  found`,
    404
  );
  next(error);
});

// catch errors globally
app.use(globalErrorHandlerMiddleware);

export default app;
