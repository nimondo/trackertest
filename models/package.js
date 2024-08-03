const mongoose = require("mongoose");
const {
  v4: uuidv4
} = require("uuid");

const packageSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
    required: true,
    unique: true,
  },
  active_delivery_id: {
    type: String,
    ref: "Delivery",
  },
  description: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  depth: {
    type: Number,
    required: true,
  },
  from_name: {
    type: String,
    required: true,
  },
  from_address: {
    type: String,
    required: true,
  },
  from_location: {
    type: {
      lat: {
        type: String,
        required: true,
      },
      long: {
        type: String,
        required: true,
      },
    },
  },
  to_name: {
    type: String,
    required: true,
  },
  to_location: {
    type: {
      lat: {
        type: String,
        required: true,
      },
      long: {
        type: String,
        required: true,
      },
    },
  },
  to_address: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Package", packageSchema);