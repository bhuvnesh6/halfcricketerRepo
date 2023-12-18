const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/halfcricketer");

const ratingplayer = mongoose.Schema({
    user:{
            type: mongoose.Schema.ObjectId,
            ref: 'admins'
        },
    comment:{
        type:String,
    },

    player:{
       type: mongoose.Schema.ObjectId,
        ref:'players'}, 
    heart: "Number"    
})


module.exports = mongoose.model("rating", ratingplayer);