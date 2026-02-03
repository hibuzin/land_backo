const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Message',
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
    });

    res.json({ success: true, message: 'Message sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Email failed' });
  }
});

module.exports = router;
