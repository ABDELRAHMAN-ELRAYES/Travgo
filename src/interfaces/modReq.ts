import { Express } from 'express';
import { IFile } from './fileUpload';
import { userDoc } from './userDoc';
declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
      file?: IFile;
    }
    interface Locals {
      user?: User | undefined;
    }
  }
}
