import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import Tour from '../models/tourModel';
import { User } from '../models/userModel';

// render the home page with the overview tours
export const renderHome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find().limit(3);
    res.status(200).render('home', {
      title: 'Home',
      tours,
    });
  }
);
export const renderHomeWithUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const tours = await Tour.find().limit(3);
    res.status(200).render('home', {
      title: 'Home',
      tours,
      user,
    });
  }
);
// render the shop page
export const renderShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find();
    res.status(200).render('shop', {
      title: 'Shop',
      tours,
    });
  }
);
// render the shop page
export const renderSignup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find();
    res.status(200).render('signup', {
      title: 'Signup',
    });
  }
);
// render the shop page
export const renderLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find();
    res.status(200).render('login', {
      title: 'Login',
    });
  }
);
// render profile page
export const renderProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find();
    res.status(200).render('profile', {
      title: 'Profile',
    });
  }
);

// update user data
//'user-66e9a0c42ee9aac17a25f004-1726587493849.jpeg
export const updateUserData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body.photo = req.file?.filename;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    // //! there is an error that when rendering the profile the photo doesn't appear but after reloading the page the photo appear
    // res.status(200).render('profile', {
    //   title: 'Profile',
    //   user: req.user,
    // });
    res.redirect('/profile');
  }
);
