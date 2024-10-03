import { Request, Response, NextFunction } from 'express';
import Tour from './../models/tourModel';
import { validateTourId } from '../utils/validateId';
import { APIFeatures } from '../utils/apiFeature';
import { catchAsync } from '../utils/catchAsync';
import { ErrorHandler } from '../utils/error';
import { title } from 'process';

export const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!validateTourId(req.params.id)) {
      res.status(404).send('not valid id');
    }

    // const tour = await Tour.findById(req.params.id);
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return next(new ErrorHandler('tour not found', 404));
    }

    res.status(200).json({
      status: 'success',
      tour: {
        tour: tour,
      },
    });
  }
);

export const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = Tour.find().populate('guides', '-_id name photo');

    if (Object.keys(req.query).length) {
      const apiFeatures = new APIFeatures(query, req.query).filter().sort();
    }
    const tours = await query;

    if (!tours) {
      return next(new ErrorHandler('tour not found', 404));
    }
    res.status(200).json({
      status: 'success',
      results: tours.length,
      tours: {
        tours,
      },
    });
  }
);

export const createNewTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newTour = await Tour.create(req.body);
    if (!newTour) {
      return next(new ErrorHandler('tour not found', 404));
    }
    res.status(200).json({
      status: 'success',
      tour: newTour,
    });
  }
);
export const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!validateTourId(req.params.id)) {
      res.status(404).send('not valid id');
    }
    // const updatedTour = await Tour.findById(req.params.id).updateOne(req.body);
    const updatedTour = await Tour.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (!updatedTour) {
      return next(new ErrorHandler('tour not found', 404));
    }
    res.status(200).json({
      status: 'success',
      tour: updatedTour,
    });
  }
);
export const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!validateTourId(req.params.id)) {
      res.status(404).send('not valid id');
    }

    const deletedTour = await Tour.deleteOne({ _id: req.params.id });
    if (!deletedTour) {
      return next(new ErrorHandler('tour not found', 404));
    }
    res.status(200).json({
      status: 'success',
      tour: deletedTour,
    });
  }
);

export const searchForTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { price, rate, sort, startDate, difficulty } = req.body;
    let query: any = {};
    if (price && price != 'All') query.price = { $lte: price };
    if (rate && rate != 'All') query.ratingsAverage = { $lte: rate };
    if (difficulty && difficulty != 'All') query.difficulty = difficulty;
    if (startDate)
      query.startDates = { $elemMatch: { $gte: new Date(startDate) } };
    const documents = Tour.find(query);
    if (sort) documents.sort(sort);
    const tours = await documents;
    res.render('shop', {
      title: 'Shop',
      tours,
    });
  }
);
