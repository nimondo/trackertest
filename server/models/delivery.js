const mongoose = require("mongoose");
const {
  v4: uuidv4
} = require("uuid");
export const deliveryStatus = {
  OPEN: "open",
  PICKED_UP: "picked-up",
  IN_TRANSIT: "in-transit",
  DELIVERED: "delivered",
  FAILED: "failed",
};
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
  userId: {
    type: String,
    ref: 'User',
    required: false
  },
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
    enum: [deliveryStatus.OPEN, deliveryStatus.PICKED_UP, deliveryStatus.FAILED, deliveryStatus.IN_TRANSIT, deliveryStatus.DELIVERED],
    default: deliveryStatus.OPEN,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Delivery", deliverySchema);