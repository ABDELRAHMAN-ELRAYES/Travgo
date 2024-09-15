import { Express } from 'express';
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
    interface Locals {
      user?: any;
    }
  }
}
