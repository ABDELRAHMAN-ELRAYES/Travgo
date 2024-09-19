import mongoose, { Schema, model } from 'mongoose';
import Tour from './tourModel';
import { iReview } from '../interfaces/iReview';

const reviewSchema = new Schema<iReview>({
  review: {
    type: String,
    required: [true, 'The review must have a description'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  tour: {
    type: Schema.ObjectId,
  },
  user: {
    type: Schema.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.methods.calculateRatings = async function (tourId: string) {
  const reviews = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        ratingsQuantity: { $sum: 1 },
        ratingsAverage: { $avg: 'rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: reviews.ratingsAverage,
    ratingsQuantity: reviews.ratingsQuantity,
  });
};
reviewSchema.post<iReview>('save',function(){
    (this.constructor as any).calculateRatings(this.tour);
})
const Review = model('Review', reviewSchema);
export default Review;
