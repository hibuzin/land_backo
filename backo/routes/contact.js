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
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 10000,
            socketTimeout: 10000,
        });


        // 🔍 DEBUG HERE
        transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP Verify Error:', error);
            } else {
                console.log('SMTP Server is ready');
            }
        });

        await transporter.sendMail({
            from: `"Contact Form" <${process.env.EMAIL_USER}>`,
            replyTo: email,
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
        console.error('❌ Email Error Details ↓↓↓');
        console.error('Message:', err.message);
        console.error('Code:', err.code);
        console.error('Command:', err.command);
        console.error('Stack:', err.stack);

        res.status(500).json({
            message: 'Email failed',
            error: err.message,
        });
    }
});

module.exports = router;
