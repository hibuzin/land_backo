const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();


// ================= REGISTER =================
router.post('/register', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // Normalize email
    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6 digit OTP as STRING
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiresAt,
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    // ⚠️ DEV ONLY – remove in production
    res.status(200).json({
      message: 'OTP generated',
      otp,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ================= VERIFY OTP =================
router.post('/verify-otp', async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP required' });
    }

    email = email.trim().toLowerCase();
    otp = otp.toString(); // Force string

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.json({ message: 'OTP verified successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Verify OTP first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;