import express, { Request, Response, NextFunction } from 'express';
import {
  morganMiddleware,
  bodyParser,
  handMadeMiddleware,
  globalErrorHandlerMiddleware,
} from './middlewares/middlewares';
import tourRouter from './routes/toursRoute';
import userRouter from './routes/userRoute';
import { ErrorHandler } from './utils/error';

const app = express();

app.use(morganMiddleware);
app.use(bodyParser);
app.use(handMadeMiddleware);

tourRouter.use(express.static('public'));
userRouter.use(express.static('public'));

app.use('/tours', tourRouter);
app.use('/users', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorHandler(
    `This URL provided ${req.originalUrl} is not  found`,
    404
  );
  next(error);
});
app.use(globalErrorHandlerMiddleware);

export default app;
