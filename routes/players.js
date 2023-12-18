const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/halfcricketer");


const playerModel = mongoose.Schema({
    name: String,
    discription: String,
    image: String,
    users:[{
      type: mongoose.Schema.Types.Mixed,
      ref: 'admins',
    }],
    ratings: {
        type: mongoose.Mixed,
        /*1: Number,
        2: Number,
        3: Number,
        4: Number,
        5: Number,
        default: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, */
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
      feedbackC :[{
    type: mongoose.Schema.ObjectId,
    ref: 'rating'
  }]
})

playerModel.set('toObject', { getters: true });
playerModel.set('toJSON', { getters: true });

playerModel.path('ratings').get(function (r) {
  let items = Object.entries(r);
  let sum = 0;
  let total = 0;
  for (let [key, value] of items) {
    total += value;
    sum += value * parseInt(key);
  }
  return total === 0 ? 0 : Math.round(sum / total);
});
  

module.exports = mongoose.model("players", playerModel);
