"use strict";

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const sendResetEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., smtp-relay.brevo.com
    port: process.env.EMAIL_PORT, // e.g., 587
    secure: false, // false for 587, true for 465
    auth: {
      user: process.env.EMAIL_USERNAME, // your Brevo SMTP user
      pass: process.env.EMAIL_PASSWORD, // your Brevo SMTP key
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `"MY Todo List" <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: "Password Reset Token (Valid for 15 minutes)",
    text: options.message,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendResetEmail,
};
