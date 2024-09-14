import { Router } from 'express';
import { renderHome, renderShop } from '../controllers/viewControllers';
import { protect } from '../controllers/authControllers';
const viewRouter = Router();

viewRouter.route('/').get(renderHome);
viewRouter.route('/shop').get(protect ,renderShop);

export default viewRouter;
