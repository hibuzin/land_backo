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

        // Verify the token against your Google Client ID
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });

        // Extracting 'sub' is important for your 'googleId' field
        const { email, name, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if they don't exist
            user = await User.create({
                name,
                email,
                avatar: picture,
                googleId: sub, // 'sub' is the unique Google ID
                authProvider: 'google',
                isVerified: true
            });
        } else if (user.authProvider !== 'google') {
            // Update existing user to Google provider if needed
            user.authProvider = 'google';
            user.googleId = sub;
            await user.save();
        }

        // Generate your internal JWT for the app session
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
                avatar: user.avatar
            } 
        });

    } catch (err) {
        console.error('Google login error:', err.message);
        res.status(401).json({ error: err.message });
    }
});

module.exports = router;
