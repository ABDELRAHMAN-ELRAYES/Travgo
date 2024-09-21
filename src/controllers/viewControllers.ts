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
    console.log(tours);

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
// render tour profile page
export const renderTourProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findOne({ slug: req.params.slug })
      .populate('guides', '-_id name photo role')
      .populate('reviews', 'review rating user');
    res.status(200).render('tour', {
      title: 'Profile',
      tour,
    });
  }
);

// update user data
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
