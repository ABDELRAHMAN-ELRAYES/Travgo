import { Router } from 'express';
import {
  getTour,
  getAllTours,
  createNewTour,
  updateTour,
  deleteTour,
  searchForTours,
} from './../controllers/toursController';
import { protect, restrictTo } from '../controllers/authControllers';
import reviewRouter from './reviews';

const tourRouter = Router();

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter
  .route('/')
  .get(protect, restrictTo('admin', 'lead-guide'), getAllTours)
  .post(createNewTour);
tourRouter.route('/:id').get(getTour).delete(deleteTour).put(updateTour);
// tourRouter.route('/search-tours').post(searchForTours);

export default tourRouter;
