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

    if (!idToken) {
      return res.status(400).json({ message: 'idToken is required' });
    }

    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {
      sub: googleId,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    if (!email_verified) {
      return res.status(401).json({ message: 'Email not verified by Google' });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        googleId,
        authProvider: 'google',
        isVerified: true,
      });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Google login successful',
      token,
      user,
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed' });
  }
});

module.exports = router;
