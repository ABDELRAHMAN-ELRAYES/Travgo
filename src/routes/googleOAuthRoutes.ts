import { Router } from 'express';
import passport from '../middlewares/googleOAuth';
import { successGoogleAuthorization } from '../controllers/googleOAuthControllers';

const googleRouter = Router();

googleRouter
  .route('/')
  .get(
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
    })
  );

googleRouter.route('/callback').get(
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  successGoogleAuthorization
);

export default googleRouter;
