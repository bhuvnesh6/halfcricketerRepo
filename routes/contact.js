const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/halfcricketer");

const contactForm = mongoose.Schema({
    name:{
        type: String,
        require
    },
    email:{
        type: String,
        require
    },
    issue:{
        type: String,
        require
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("contact", contactForm);