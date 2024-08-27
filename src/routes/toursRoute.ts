import express from "express";
import {
  getTour,
  getAllTours,
  createNewTour,
  updateTour,
  deleteTour,
} from "./../controllers/toursController";

const tourRouter = express.Router();

tourRouter
  .route("/:id")
  .get(getTour)
  .post(createNewTour)
  .delete(deleteTour)
  .put(updateTour);
tourRouter.route("/").get(getAllTours);

export default tourRouter;
