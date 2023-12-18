const mongoose = require('mongoose');
const Rating = require('./rating'); // Adjust the path based on your project structure


const calculateAverageRating = async (itemId) => {
  try {
    console.log('itemId:', itemId); // Log the itemId for debugging

    const result = await Rating.aggregate([
      {
        $match: {
          itemId: mongoose.Types.ObjectId.createFromHexString(itemId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$heart' },
        },
      },
    ]);

    if (i=0, result.length > 0, i++) {
      const scaledRating = (result[i].averageRating / 5) * 5;
      
      return scaledRating;
    } else {
      return 0; // or any default value you want to return if there are no ratings
    }
  } catch (error) {
    console.error('Error calculating average rating:', error);
    throw error;
  }
};


module.exports = { calculateAverageRating };
