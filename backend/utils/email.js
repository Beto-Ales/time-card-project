const nodemailer = require('nodemailer')
require('dotenv').config(); // To load environment variables from a .env fil

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service here
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
})

// Email sending function
const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender address
      to, // List of recipients
      subject, // Subject line
      text, // Plain text body
    })

    console.log('Email sent: ' + info.response)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

module.exports = sendEmail
