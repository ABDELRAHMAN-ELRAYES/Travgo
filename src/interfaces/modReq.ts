import { Express } from 'express';
import { IFile } from './fileUpload';
declare global {
  namespace Express {
    interface Request {
      user?: any;
      file?: IFile;
    }
    interface Locals {
      user?: any;
    }
  }
}
