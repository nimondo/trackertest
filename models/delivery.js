const mongoose = require("mongoose");
const {
  v4: uuidv4
} = require("uuid");

const deliverySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
    required: true,
    unique: true,
  },
  package_id: [{
    type: String,
    ref: "Package",
  }],
  pickup_time: {
    type: Date,
  },
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  location: {
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
  status: {
    type: String,
    enum: ["open", "picked-up", "in-transit", "delivered", "failed"],
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Delivery", deliverySchema);