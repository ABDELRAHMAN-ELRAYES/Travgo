import { Router } from 'express';
import {
  renderHome,
  renderLogin,
  renderProfile,
  renderUserReviews,
  renderUserBookings,
  renderUserFavourites,
  renderShop,
  renderSignup,
  renderTourProfile,
} from '../controllers/viewControllers';
import { isLoggedIn, protect } from '../controllers/authControllers';
import { uploadUserPhotoMiddleware } from '../middlewares/middlewares';
import { updateUserData } from '../controllers/viewControllers';
import { createTourBooking } from '../controllers/bookingControllers';
const viewRouter = Router();

viewRouter.route('/').get(isLoggedIn, renderHome);
viewRouter
  .route('/home')
  .get(protect, isLoggedIn, createTourBooking, renderHome);
viewRouter.route('/shop').get( isLoggedIn, renderShop);
viewRouter.route('/login').get(renderLogin);
viewRouter.route('/signup').get(renderSignup);
viewRouter.route('/tour/:slug').get(isLoggedIn, renderTourProfile);

// viewRouter.use(protect, isLoggedIn);
viewRouter.route('/profile').get(protect, isLoggedIn, renderProfile);
viewRouter.get('/profile/reviews', protect, isLoggedIn, renderUserReviews);
viewRouter.get('/profile/bookings', protect, isLoggedIn, renderUserBookings);
viewRouter.get(
  '/profile/favourites',
  protect,
  isLoggedIn,
  renderUserFavourites
);

viewRouter
  .route('/submit-user-data')
  .post(protect, uploadUserPhotoMiddleware, updateUserData);

export default viewRouter;
