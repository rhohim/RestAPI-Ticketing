require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Set it to false if your SMTP server doesn't use SSL
    tls: {
        rejectUnauthorized: false
      },
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
};