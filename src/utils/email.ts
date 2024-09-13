import nodemailer from 'nodemailer';
import { catchAsync } from './catchAsync';
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.COMPANY_GMAIL,
    pass: process.env.COMPANY_GMAIL_PASSWORD,
  },
});
export const options = {
  from: process.env.COMPANY_GMAIL, // sender address
  to: 'abdelrahmanelrayes10@gmail.com',
  subject: 'Travgo urgent email ✔',
  text: 'Hello world?',
  html: '<b>Hello world?</b>',
};
export const sendMail = async (
  transporter: nodemailer.Transporter,
  options: nodemailer.SendMailOptions
) => {
  console.log('Sending email...');
  await transporter.sendMail(options);
  console.log('Email sent correctly');
};
