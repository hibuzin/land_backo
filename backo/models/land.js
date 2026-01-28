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

// ✅ Prevent overwrite error
module.exports = mongoose.models.Land || mongoose.model('Land', LandSchema);
