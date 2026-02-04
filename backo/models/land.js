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
    squareFeet: {
      type: Number,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    mobile: {type: String,required: true},

    images: [
      {
        type: String,
        required: true
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
