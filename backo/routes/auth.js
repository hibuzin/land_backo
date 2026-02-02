const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const router = express.Router();

// 🔹 POST /api/auth/google
router.post('/google', async (req, res) => {
    try {
        const { idToken } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub } = payload; // sub = googleId

        // ✅ 1. Find user by googleId FIRST
        let user = await User.findOne({ googleId: sub });

        if (!user) {
            const userData = {
                name,
                avatar: picture,
                googleId: sub,
                authProvider: 'google',
                isVerified: true,
            };

            // ✅ 2. Only add email if it exists
            if (email) userData.email = email;

            user = await User.create(userData);
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });

    } catch (err) {
        console.error('Google login error:', err);
        res.status(401).json({ message: err.message });
    }
});


module.exports = router;
