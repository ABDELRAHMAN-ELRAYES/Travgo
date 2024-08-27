import express, { Request, Response, NextFunction } from "express";
import {
  morganMiddleware,
  bodyParser,
  handMadeMiddleware,
} from "./middlewares/middlewares";
import tourRouter from "./routes/toursRoute";

const app = express();

app.use(morganMiddleware);
app.use(bodyParser);
app.use(handMadeMiddleware);

app.use("/tours", tourRouter);
export default app;
