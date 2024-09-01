import { iError } from "./../interfaces/iError";

export class ErrorHandler implements iError {
  status: string;
  statusCode: number;
  name: string = "error";
  message: string;
  constructor(msg: string, statusCode: number) {
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "Error";
    this.message = msg;
    Error.captureStackTrace(this, this.constructor);
  }
}
