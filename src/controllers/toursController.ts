import { Request, Response, NextFunction } from "express";
import Tour from "./../models/tourModel";

export const getTour = (req: Request, res: Response) => {};

export const getAllTours = async (req: Request, res: Response) => {
  const tours = await Tour.find();
  res.status(200).json({
    status: "success",
    results: tours.length,
    tours: {
      tours,
    },
  });
};

export const createNewTour = (req: Request, res: Response) => {};

export const updateTour = (req: Request, res: Response) => {};

export const deleteTour = (req: Request, res: Response) => {};
