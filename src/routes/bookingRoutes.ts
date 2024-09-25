import { Router } from 'express';
import { checkoutPaymentSession } from '../controllers/bookingControllers';
import { isLoggedIn, protect } from '../controllers/authControllers';

const bookingRouter = Router();

bookingRouter
  .route('/checkoutPaymentSession/:tourId')
  .get(protect, isLoggedIn, checkoutPaymentSession);

export default bookingRouter;
