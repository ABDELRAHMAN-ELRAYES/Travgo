import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from './../models/userModel';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { ErrorHandler } from '../utils/error';

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/img/users/'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler(
        'This not an image, choose a proper file image!.',
        400
      ) as any,
      false
    );
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter: multerFilter,
});
export const uploadUserPhotoMiddleware = upload.single('photo');

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      user,
    });
  }
);
export const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      users: {
        users,
      },
    });
  }
);
export const createNewUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);

    res.status(200).json({
      status: 'success',
      user,
    });
  }
);
export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.updateOne({ _id: req.params.id }, req.body);

    res.status(200).json({
      status: 'success',
      user,
    });
  }
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.deleteOne({ _id: req.params.id });

    res.status(200).json({
      status: 'success',
    });
  }
);
