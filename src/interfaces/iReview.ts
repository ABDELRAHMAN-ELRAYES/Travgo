import mongoose from 'mongoose';

export interface iReview {
  review: string;
  rating: number;
  tour: any;
  user: any;
  createdAt: Date;
  calculateRatings: (param: string) => void;
}
