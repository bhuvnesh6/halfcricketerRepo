const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/halfcricketer");

// Define the Comment Schema
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admins', // Assuming you have a User model, replace 'User' with the actual model name
    required: true,
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'article', // Assuming you have a Post model, replace 'Post' with the actual model name
    required: true,
  },
  replies: [{
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins',
      required: true,
    },
    replies: [{
      text: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admins',
        required: true,
      },
    }],
  }],
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create the Comment model using the schema
module.exports = mongoose.model('comment', commentSchema);

// Export the Comment model

