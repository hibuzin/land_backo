const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  land: { type: mongoose.Schema.Types.ObjectId, ref: 'Land', required: true },
}, { timestamps: true });

// Prevent duplicates: same user cannot add same land twice
WishlistSchema.index({ user: 1, land: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
