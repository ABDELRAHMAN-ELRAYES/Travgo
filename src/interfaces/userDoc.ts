import mongoose from 'mongoose';
export interface userDoc extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  active: boolean;
  role: string;
  passwordChangedAt?: Date;
  passwordResetToken?: String;
  passwordResetExpires?: Date;
  photo?: string;
  verifyPassword(paramOne: string, paramTwo: string): Promise<boolean>;
  checkPasswordReset(param: number): boolean;
  createResetPasswordToken(): string;
}
