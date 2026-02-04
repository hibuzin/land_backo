const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔹 POST /api/auth/google
router.post('/google', async (req, res) => {
    try {
        const { idToken } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });


        const { email, name, picture, sub } = ticket.getPayload();


        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar: picture,
                googleId: sub,
                authProvider: 'google',
                isVerified: true,
            });
        } else if (user.authProvider !== 'google') {
            // Update existing user to Google provider if needed
            user.authProvider = 'google';
            user.googleId = sub;
            await user.save();
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
