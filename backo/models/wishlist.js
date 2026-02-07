const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // ensures one wishlist per user
  },
  lands: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land' // reference to Land model
  }]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
