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
    res.redirect('/profile/favourites');
  }
);
export const removeTourFromUserFavourites = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await FavouriteTour.findByIdAndDelete(req.params.tourId);
    res.redirect('/profile/favourites');
  }
);
