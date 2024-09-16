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
viewRouter.route('/shop').get(protect,isLoggedIn, renderShop);
viewRouter.route('/profile').get(protect ,isLoggedIn, renderProfile);
viewRouter.route('/login').get(renderLogin);
viewRouter.route('/signup').get(renderSignup);

export default viewRouter;
