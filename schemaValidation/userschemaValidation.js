const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: {
    type: String,
    default: null,
  },
  image: {
    type: Array,
    default: null,
  },
},{
  timestamps:true
});

let user = mongoose.model("user", userSchema);

module.exports = user;
