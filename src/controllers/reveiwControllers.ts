import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import Review from './../models/reviewModel';
import mongoose from 'mongoose';
import Tour from '../models/tourModel';
import { ErrorHandler } from '../utils/error';
import { userDoc } from '../interfaces/userDoc';

export const setTourUserRequestId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.user) req.body.user = (req.user as userDoc)._id;
  if (!req.body.tour)
    req.body.tour = new mongoose.Types.ObjectId(req.params.tourId);
  next();
};

export const getReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.reviewId);
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
export const getAllReviewsForUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await Review.find({
      user: (req.user as userDoc)._id,
    }).populate({
      path: 'tour',
      select: 'name imageCover',
    });
    res.status(200).json({
      status: 'success',
      results: reviews.length,
      reviews,
    });
  }
);

export const createNewReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const previousReview = await Review.find({
      tour: req.body.tour,
      user: req.body.user,
    });
    console.log(req.body);
    if (previousReview.length > 0) {
      return next(new ErrorHandler('You already reviewed this tour !.', 401));
    }
    req.body.rating = req.body.rating as number;

    const review = await Review.create(req.body);

    const tour = await Tour.findById(req.params.tourId);

    res.redirect(`/tour/${tour?.slug}`);
  }
);

export const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.redirect('/profile/reviews');
  }
);

export const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect('/profile/reviews');
  }
);
