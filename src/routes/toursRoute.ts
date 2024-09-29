import { Router } from 'express';
import {
  getTour,
  getAllTours,
  createNewTour,
  updateTour,
  deleteTour,
  searchForTours,
} from './../controllers/toursController';
import {
  isLoggedIn,
  protect,
  restrictTo,
} from '../controllers/authControllers';
import reviewRouter from './reviews';
import {
  addTourToUserFavourites,
  removeTourFromUserFavourites,
} from '../controllers/favouriteTourControllers';

const tourRouter = Router();

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter
  .route('/')
  .get(protect, restrictTo('admin', 'lead-guide'), getAllTours)
  .post(createNewTour);
tourRouter.route('/:id').get(getTour).delete(deleteTour).put(updateTour);

tourRouter.get(
  '/fav-tour/:tourId',
  protect,
  isLoggedIn,
  addTourToUserFavourites
);
tourRouter.get(
  '/del-fav-tour/:tourId',
  protect,
  isLoggedIn,
  removeTourFromUserFavourites
);
// tourRouter.route('/search-tours').post(searchForTours);

export default tourRouter;
