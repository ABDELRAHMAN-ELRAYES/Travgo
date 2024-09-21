import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import Review from './../models/reviewModel';
import mongoose from 'mongoose';
import Tour from '../models/tourModel';

export const setTourUserRequestId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.tour)
    req.body.tour = new mongoose.Types.ObjectId(req.params.tourId);
  next();
};

export const getReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      Review,
    });
  }
);
export const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await Review.find(req.body);
    res.status(200).json({
      status: 'success',
      results: reviews.length,
      reviews,
    });
  }
);
export const createNewReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body.rating = req.body.rating as number;
    const review = await Review.create(req.body);

    const tour = await Tour.findById(req.params.tourId);

    res.redirect(`/tour/${tour?.slug}`);
  }
);
export const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      review,
    });
  }
);

export const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
    });
  }
);
