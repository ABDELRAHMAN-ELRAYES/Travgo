import { Router } from 'express';
import {
  renderHome,
  renderHomeWithUser,
  renderLogin,
  renderProfile,
  renderShop,
  renderSignup,
  renderTourProfile,
} from '../controllers/viewControllers';
import { isLoggedIn, protect } from '../controllers/authControllers';
import { uploadUserPhotoMiddleware } from '../middlewares/middlewares';
import { updateUserData } from '../controllers/viewControllers';
const viewRouter = Router();

viewRouter.route('/').get(isLoggedIn, renderHome);
viewRouter.route('/shop').get(protect, isLoggedIn, renderShop);
viewRouter.route('/profile').get(protect, isLoggedIn, renderProfile);
viewRouter.route('/login').get(renderLogin);
viewRouter.route('/signup').get(renderSignup);
viewRouter.route('/tour/:slug').get(isLoggedIn,renderTourProfile);

viewRouter
  .route('/submit-user-data')
  .post(protect, uploadUserPhotoMiddleware, updateUserData);

export default viewRouter;
