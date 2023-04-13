const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  imdbID: String,
  image: String,
  reviewText: String,
  rating: Number,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

reviewSchema.set("timestamps", true);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
