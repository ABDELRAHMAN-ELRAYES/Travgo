export interface userDoc extends Document {
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
