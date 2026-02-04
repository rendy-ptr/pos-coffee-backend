import nodemailer from 'nodemailer';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const transporter = nodemailer.createTransport(
  isDevelopment
    ? {
        host: process.env.EMAIL_HOST || 'localhost',
        port: Number(process.env.EMAIL_PORT) || 1025,
        secure: false,
      }
    : {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      }
);
