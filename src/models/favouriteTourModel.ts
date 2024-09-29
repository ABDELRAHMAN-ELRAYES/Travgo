import mongoose, { Query, Schema, model } from 'mongoose';

const favouriteTourSchema = new Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    require: [true, 'It must be a tour to add to favourites'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: [true, 'It must be a user to add tour to his favourites'],
  },
});
favouriteTourSchema.pre('save', async function (this: any, next) {
  const tour = this.tour;
  const isFound = await this.constructor.findOne({ tour });
  if (isFound) {
    throw new Error('Tour already exists in the favourites.');
  }
  next();
});

const FavouriteTour = model('FavouriteTour', favouriteTourSchema);
export default FavouriteTour;
