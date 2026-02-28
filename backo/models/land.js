const mongoose = require('mongoose');

const landSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    squareFeet: { type: Number, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    mobile: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: {
      type: [String],  // <-- correct array of strings
      default: []      // default empty array
    },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }); 


module.exports = mongoose.model('Land', landSchema);
