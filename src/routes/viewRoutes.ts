import { Router } from 'express';
import {
  renderHome,
  renderHomeWithUser,
  renderLogin,
  renderShop,
  renderSignup,
} from '../controllers/viewControllers';
import { protect } from '../controllers/authControllers';
const viewRouter = Router();

viewRouter.route('/').get(renderHome);
viewRouter.route('/shop').get(protect, renderShop);
viewRouter.route('/login').get(renderLogin);
viewRouter.route('/signup').get(renderSignup);

export default viewRouter;
