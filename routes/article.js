const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/halfcricketer");

const articles = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
     thumbnail: {
       type: String, // Assuming the thumbnail is a URL to an image
       required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    views:{
        type: Number,
        default:0
    },
    Shares:{
        type: Number,
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments:[{
        type: mongoose.Schema.Types.Mixed,
        ref:"comment"
    }],
    likes:[{
        type: mongoose.Schema.Types.Mixed,
        ref: "admins"
    }],
    tags: {
        type: [String], // Assuming tags are an array of strings
        default: []
      }
    // Additional fields can be added as needed
}, { strict: false });

module.exports = mongoose.model("article", articles);
