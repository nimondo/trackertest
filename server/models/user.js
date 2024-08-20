const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userRole = {
  ADMIN: "admin",
  DRIVER: "driver",
  CUSTOMER: "customer"
}
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [userRole.CUSTOMER, userRole.DRIVER, userRole.ADMIN],
    default: userRole.CUSTOMER,
    required: true,
  },
});

userSchema.plugin(uniqueValidator);

// module.exports = mongoose.model("User", userSchema);

module.exports = {
  User: mongoose.model("User", userSchema),
  userRole: userRole
};