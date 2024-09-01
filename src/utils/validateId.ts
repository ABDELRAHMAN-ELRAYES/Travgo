import mongoose from "mongoose";

export const validateTourId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);
