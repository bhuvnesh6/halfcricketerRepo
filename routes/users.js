const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/halfcricketer");

const adminSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  tag: {
    type: String,
    // default : '/images/admintag'
  },
  name: String,
  bio: {
    type: String,
    default: 'Write somthing about you'
  },
  dp: {
    type: String,
    default: 'defaullt.jpeg'
  },
  password: String,
  secret: String,
  comments: [{
    type: mongoose.Schema.Types.Mixed,
    ref: "comment"
  }],
  followers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'admins',
  }],
  type: String,
  following: [{
    type: mongoose.Schema.ObjectId,
    ref: 'admins',
  }],
  accepting: { type: Boolean, default: false },
});

adminSchema.plugin(plm);
module.exports = mongoose.model("admins", adminSchema);

