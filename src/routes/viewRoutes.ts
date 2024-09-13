import {Router} from 'express';
import { renderHome } from '../controllers/viewControllers';


const viewRouter = Router();

viewRouter.route('/').get(renderHome);


export default viewRouter;