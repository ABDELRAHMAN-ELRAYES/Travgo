import { Schema, model } from 'mongoose';
import validator from 'validator';
import { userDoc } from '../interfaces/userDoc';
import bycrypt from 'bcryptjs';
import crypto from 'crypto';

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
      validator: function (this: userDoc, element: string) {
        return element === this.password;
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
// hashing the users password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bycrypt.hash(this.password, 12);
  this.passwordConfirm = JSON.stringify(undefined);
  next();
});
// a method to compare the entered password and original user password
userSchema.methods.verifyPassword = async function (
  enteredPass: string,
  userPass: string
) {
  if (!enteredPass || !userPass) {
    return new Error('Both passwords must be provided for comparison');
  }
  return await bycrypt.compare(enteredPass, userPass);
};
// check if the password is changed after the token fired
userSchema.methods.checkPasswordReset = function (tokenStamp: number) {
  if (!this.passwordChangedAt) {
    return false;
  }
  const passwordResetStamp = Math.floor(
    this.passwordChangedAt.getTime() / 1000
  );
  return tokenStamp < passwordResetStamp;
};
userSchema.methods.createResetPasswordToken = function () {
  let token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha-256')
    .update(token)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return this.passwordResetToken;
};
const User = model<userDoc>('User', userSchema);
export default User;
