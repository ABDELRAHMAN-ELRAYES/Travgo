import mongoose from 'mongoose';

export interface iReview {
  review: string;
  rating: number;
  tour: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  calculateRatings: (param: string) => void;
}
