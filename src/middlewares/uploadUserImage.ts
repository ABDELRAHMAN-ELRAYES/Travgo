import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { ErrorHandler } from '../utils/error';
import { Request } from 'express';
import { userDoc } from '../interfaces/userDoc';

export const createMulterMiddleware = (
  folderName: string,
  fieldName: string
) => {
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../public/img/${folderName}`));
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `user-${(req.user as userDoc)?._id || 'registered-user'}-${Date.now()}.${file.mimetype.split('/')[1]}`
      );
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
          'This is not an image, Choose a Proper image!. ',
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
  return upload.single(fieldName);
};
