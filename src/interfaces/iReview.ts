
import { Query } from "mongoose";
export interface IReviewQuery extends Query<iReview, iReview> {
  rev?: iReview; // Add the rev property here
}
export interface iReview{
  review: string;
  rating: number;
  tour: any;
  user: any;
  createdAt: Date;
  // rev?:any,
  calculateRatings: (param: string) => void;
  // findOne: any;
}
