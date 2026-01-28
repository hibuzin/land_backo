const mongoose = require('mongoose');

const LandSchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Land', LandSchema);
