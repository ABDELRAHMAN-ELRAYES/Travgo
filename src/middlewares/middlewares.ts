import express from "express";
import morgan from "morgan";
import { Request, Response, NextFunction } from "express";

export const morganMiddleware = morgan("dev");
export const bodyParser = express.json();
export const handMadeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Good Request");
  next();
};
