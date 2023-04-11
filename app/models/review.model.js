const mongoose = require("mongoose");

const Review = mongoose.model(
  "Review",
  new mongoose.Schema({
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    title: String,
    imdbID: String,
    image: String,
    reviewText: String,
    rating: Number,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
  })
);

module.exports = Review;