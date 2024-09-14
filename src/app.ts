import express, { Request, Response, NextFunction } from 'express';
import {
  morganMiddleware,
  bodyParser,
  globalErrorHandlerMiddleware,
  cookiesParser,
} from './middlewares/middlewares';
import tourRouter from './routes/toursRoute';
import userRouter from './routes/userRoute';
import viewRouter from './routes/viewRoutes';

import { ErrorHandler } from './utils/error';
import path from 'path';

const app = express();

// middlewares
app.use(morganMiddleware);
app.use(bodyParser);
app.use(cookiesParser);

// setup the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// setup the static files
app.use(express.static(path.join(__dirname, 'public')));

// all routers
app.use('/', viewRouter);
app.use('/tours', tourRouter);
app.use('/users', userRouter);

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
