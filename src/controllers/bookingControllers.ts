import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import Tour from '../models/tourModel';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

export const checkoutPaymentSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.params.tourId);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tour?.name} Tour`,
              description: tour?.summary,
              images: [`https://www.natours.dev/img/tours/${tour?.imageCover}`],
            },
            unit_amount: (tour?.price as number) * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour?.slug}`,
    } as Stripe.Checkout.SessionCreateParams);
    res.status(200).json({
      status: 'success',
      session,
    });
  }
);
