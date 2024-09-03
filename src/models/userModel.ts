import mongoose, { Schema, model, Document } from 'mongoose';
import validator from 'validator';
import { userDoc } from '../interfaces/userDoc';
import bycrypt from 'bcryptjs';
import { promisify } from 'util';

const userSchema = new Schema<userDoc>({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (this: userDoc, el: string) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bycrypt.hash(this.password, 12);
  this.passwordConfirm = JSON.stringify(undefined);
  next();
});
userSchema.methods.verifyPassword = async function (
  enteredPassword: string,
  userPassword: string
) {
  if (!enteredPassword || !userPassword) {
    throw new Error("Both passwords must be provided for comparison.");
  }
  return await bycrypt.compare(enteredPassword, userPassword);
};
export const User = model<userDoc>('User', userSchema);
