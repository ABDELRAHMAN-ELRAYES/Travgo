import {Router} from 'express';
import {
  getTour,
  getAllTours,
  createNewTour,
  updateTour,
  deleteTour,
} from './../controllers/toursController';
import { protect } from '../controllers/authControllers';

const tourRouter = Router();

tourRouter.route('/').get(protect, getAllTours).post(createNewTour);
tourRouter.route('/:id').get(getTour).delete(deleteTour).put(updateTour);

export default tourRouter;
