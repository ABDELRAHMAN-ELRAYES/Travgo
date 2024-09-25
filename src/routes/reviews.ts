import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createNewReview,
  updateReview,
  deleteReview,
  setTourUserRequestId,
  getAllReviewsForUser,
} from '../controllers/reveiwControllers';
import { isLoggedIn, protect } from '../controllers/authControllers';
import { renderProfile } from '../controllers/viewControllers';
const reviewRouter = Router({ mergeParams: true });

reviewRouter.use(protect);

reviewRouter
  .route('/')
  .get(setTourUserRequestId, getAllReviews)
  .post(isLoggedIn, setTourUserRequestId, createNewReview);
reviewRouter.route('/my-reviews').get(getAllReviewsForUser);


reviewRouter
  .route('/:id')
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);

export default reviewRouter;
