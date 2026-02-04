const express = require('express');
const { Resend } = require('resend');

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields required' });
        }

        // 📩 Send email to YOU
        await resend.emails.send({
            from: 'user', // test sender
            to: process.env.EMAIL_USER,
            subject: 'Contact form',
            text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
        });

        // 📩 Auto-reply to USER
        await resend.emails.send({
            from: 'hibuz',
            to: email,
            subject: 'We received your message',
            text: `Hi ${name},

Thanks for contacting us! We received your message and will get back to you shortly.

— Team`,
        });

        res.json({ success: true, message: 'Message sent' });

    } catch (err) {
        console.error('Email Error:', err);
        res.status(500).json({ message: 'Email failed', error: err.message });
    }
});

module.exports = router;
