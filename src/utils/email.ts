import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { catchAsync } from './catchAsync';
export const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port:(process.env.MAIL_PORT || 587) as number,
  secure: false,
  auth: {
    user: process.env.COMPANY_GMAIL,
    pass: process.env.COMPANY_GMAIL_PASSWORD,
  },
});
export const options = {
  from: process.env.COMPANY_GMAIL, // sender address
  to: 'nodemailertest21cp@gmail.com',
  subject: 'Travgo urgent email ✔',
  text: 'Hello world?',
  html: '<b>Hello world?</b>',
};
export const sendMail = async (
  transporter: Transporter,
  options: SendMailOptions
) => {
  console.log('Sending email...');
  await transporter.sendMail(options);
  console.log('Email sent correctly');
};
