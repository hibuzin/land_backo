const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    avatar: {
      type: String,
    },

    googleId: {
      type: String,
    },

    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate email error on Google users
UserSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true, $ne: null },
    },
  }
);

module.exports = mongoose.model('User', UserSchema);
