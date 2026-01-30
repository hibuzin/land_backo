const mongoose = require('mongoose');

const landSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    area: {
      type: Number, // sqft / cent / acre
      required: true
    },
    images: [
      {
        type: String
      }
    ],
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', landSchema);
