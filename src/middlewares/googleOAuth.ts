import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleProfile } from '../interfaces/googleProfile';
import User from '../models/userModel';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      const googleUser = profile as googleProfile;
      const email = googleUser.emails[0].value;
      const user = await User.findOne({ email });

      if (user) return done(null, profile);

      const photo = googleUser.photos[0].value;
      const name = googleUser.displayName;

      const newUser = new User({
        name,
        email,
        photo,
        password: process.env.DEFAULT_USER_PASSWORD as string,
        passwordConfirm: process.env.DEFAULT_USER_PASSWORD as string,
      });
      await newUser.save();
      return done(null, profile);
    }
  )
);
export default passport;
