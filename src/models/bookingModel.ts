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
  padi: {
    type: Boolean,
    default: true,
  },
});
bookingSchema.pre(/^find/, function (this: any, next) {
  this.populate({ path: 'Tour', select: 'tour' });
  next();
});

const Booking = model('Booking', bookingSchema);

export default Booking;
