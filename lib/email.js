// lib/email.js

import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const {
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  GMAIL_USER_EMAIL,
  NEXT_PUBLIC_APP_URL
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"  // or an appropriate redirect URI
);
oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

async function sendVerificationEmail(toEmail, token) {
  const accessToken = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: GMAIL_USER_EMAIL,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
      accessToken: accessToken?.token || accessToken
    }
  });

  const verifyUrl = `${NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  const mailOptions = {
    from: `ExpenseApp <${GMAIL_USER_EMAIL}>`,
    to: toEmail,
    subject: 'Verify your email',
    html: `<p>Thanks for signing up! Please verify your email by clicking the link below:</p>
           <p><a href="${verifyUrl}">${verifyUrl}</a></p>`
  };

  const result = await transporter.sendMail(mailOptions);
  return result;
}

export { sendVerificationEmail };
