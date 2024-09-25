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
import {
  isLoggedIn,
  protect,
  restrictTo,
} from '../controllers/authControllers';
const reviewRouter = Router({ mergeParams: true });

reviewRouter.use(protect);

reviewRouter
  .route('/')
  .get(setTourUserRequestId, getAllReviews)
  .post(isLoggedIn, setTourUserRequestId, createNewReview);
reviewRouter.route('/my-reviews').get(getAllReviewsForUser);

reviewRouter.route('/:reviewId').get(getReview).patch(updateReview);

reviewRouter.use(restrictTo('admin', 'user'));
reviewRouter.post('/del-review/:reviewId', deleteReview);
reviewRouter.post('/mod-review/:reviewId', updateReview);
export default reviewRouter;
