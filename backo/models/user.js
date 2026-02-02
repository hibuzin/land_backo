const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true, },
  avatar: String,
  googleId: String,
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'google'
  },
  isVerified: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
