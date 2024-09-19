import mongoose, { Schema, model } from 'mongoose';
import validator from 'validator';
import slugify from 'slugify';

const locationSchema = new Schema({
  description: String,
  type: String,
  coordinates: [Number],
  day: Number,
});
const tourSchema = new mongoose.Schema(
  {
    startLocation: {
      description: {
        type: String,
      },
      type: {
        type: String,
      },
      coordinates: [Number],
      address: String,
    },
    ratingsAverage: Number,
    ratingsQuantity: Number,
    images: [String],
    startDates: [Date],
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
    },
    duration: {
      type: Number,
    },
    maxGroupSize: Number,
    difficulty: String,
    guides: [
      {
        ref: 'User',
        type: mongoose.Types.ObjectId,
      },
    ],
    price: Number,
    summary: String,
    description: String,
    imageCover: String,
    locations: [locationSchema],
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.virtual("TestVirtualProps").get(function (this: any) {
//   return this.name;
// });
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});
tourSchema.pre('updateOne', (next) => {
  console.log('updated successfully');
  next();
});
const Tour = model('Tour', tourSchema);

export default Tour;
