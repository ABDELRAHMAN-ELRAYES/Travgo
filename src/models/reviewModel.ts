import mongoose, { Query, Schema, VirtualType, model } from 'mongoose';
import Tour from './tourModel';
import { iReview, IReviewQuery } from '../interfaces/iReview';

const reviewSchema = new Schema<iReview>(
  {
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
      ref: 'Tour',
      type: Schema.ObjectId,
    },
    user: {
      ref: 'User',
      type: Schema.ObjectId,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.virtual('rev');
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (this: Query<any, iReview>, next) {
  this.populate('user', 'name photo');
  next();
});

reviewSchema.statics.calculateRatings = async function (tourId: string) {
  const reviews = await this.aggregate([
    { $match: { tour: new mongoose.Types.ObjectId(tourId) } },
    {
      $group: {
        _id: '$tour',
        ratingsQuantity: { $sum: 1 },
        ratingsAverage: { $avg: '$rating' },
      },
    },
  ]);

  if (reviews.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: reviews[0].ratingsAverage,
      ratingsQuantity: reviews[0].ratingsQuantity,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};
reviewSchema.post<iReview>('save', function (this: any) {
  this.constructor.calculateRatings(this.tour);
});

reviewSchema.pre(
  /^findOneAnd/,
  async function (this: Query<iReview, iReview>, next) {
    const review = await this.model.findOne(this.getQuery());
    this.set({ rev: review });
    next();
  }
);
reviewSchema.post(
  /^findOneAnd/,
  async function (this: Query<iReview, iReview>) {
    if (!this.get('rev')?.constructor) {
      const review = await this.model.findOne(this.getQuery());
      this.set({ rev: review });
    }
    await this.get('rev').constructor.calculateRatings(this.get('rev').tour);
  }
);

const Review = model('Review', reviewSchema);

export default Review;
