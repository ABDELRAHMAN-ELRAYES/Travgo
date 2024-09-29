import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import FavouriteTour from '../models/favouriteTourModel';
import { userDoc } from '../interfaces/userDoc';

export const addTourToUserFavourites = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const favTour = await FavouriteTour.create({
      tour: req.params.tourId,
      user: (req.user as userDoc)._id,
    });
    const allFavouriteTours = await FavouriteTour.find({
      user: (req.user as userDoc)._id,
    }).populate({
      path: 'tour',
      select: 'name imageCover summary ratingsAverage ratingsQuantity',
    });
    res.status(200).render('_favouritesSection', {
      title: 'Profile | Favourites',
      tours: allFavouriteTours,
    });
  }
);
export const removeTourFromUserFavourites = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await FavouriteTour.findByIdAndDelete(req.params.tourId);
    const allFavouriteTours = await FavouriteTour.find({
      user: (req.user as userDoc)._id,
    }).populate({
      path: 'tour',
      select: 'name imageCover summary ratingsAverage ratingsQuantity',
    });
    res.status(200).render('_favouritesSection', {
      title: 'Profile | Favourites',
      tours: allFavouriteTours,
    });
  }
);
