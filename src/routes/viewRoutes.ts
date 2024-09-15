import { Router } from 'express';
import {
  renderHome,
  renderHomeWithUser,
  renderLogin,
  renderProfile,
  renderShop,
  renderSignup,
} from '../controllers/viewControllers';
import { isLoggedIn, protect } from '../controllers/authControllers';
const viewRouter = Router();

viewRouter.route('/').get(isLoggedIn, renderHome);
viewRouter.route('/shop').get(isLoggedIn, renderShop);
viewRouter.route('/profile').get(isLoggedIn, renderProfile);
viewRouter.route('/login').get(renderLogin);
viewRouter.route('/signup').get(renderSignup);

export default viewRouter;
