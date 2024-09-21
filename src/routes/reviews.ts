import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createNewReview,
  updateReview,
  deleteReview,
  setTourUserRequestId,
} from '../controllers/reveiwControllers';
import { isLoggedIn, protect } from '../controllers/authControllers';
const reviewRouter = Router({ mergeParams: true });

reviewRouter.use(protect);

reviewRouter
  .route('/')
  .get(setTourUserRequestId, getAllReviews)
  .post( isLoggedIn, setTourUserRequestId, createNewReview);

reviewRouter
  .route('/:id')
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);

export default reviewRouter;
