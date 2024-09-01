import express from "express";
import {
  getTour,
  getAllTours,
  createNewTour,
  updateTour,
  deleteTour,
} from "./../controllers/toursController";

const tourRouter = express.Router();

tourRouter.route("/").get(getAllTours).post(createNewTour);
tourRouter
  .route("/:id")
  .get(getTour)
  .delete(deleteTour)
  .put(updateTour);

export default tourRouter;
