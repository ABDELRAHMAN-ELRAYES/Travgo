import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import Tour from '../models/tourModel';

// render the home page with the overview tours
export const renderHome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find().limit(3);
    res.status(200).render('home', {
      title: 'Home',
      tours,
    });
  }
);
export const renderShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find();
    res.status(200).render('_shop', {
      title: 'Shop',
      tours,
    });
  }
);