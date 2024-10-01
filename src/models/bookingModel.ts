import { Schema, model } from 'mongoose';

const bookingSchema = new Schema({
  tour: {
    ref: 'Tour',
    type: Schema.Types.ObjectId,
    require: [true, 'The booking must be for a tour!'],
  },
  user: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    require: [true, 'The booking must be for a user!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  price: Number,
  paid: {
    type: Boolean,
    default: true,
  },
});
bookingSchema.pre(/^find/, function (this: any, next) {
  this.populate({
    path: 'tour',
    select:
      'name imageCover summary ratingsAverage ratingsQuantity slug price startDates',
  });
  next();
});

const Booking = model('Booking', bookingSchema);

export default Booking;
