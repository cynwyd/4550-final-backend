const config = require("../../config/auth.config");
const db = require("../models");
const Review = db.review;
const User = db.user;

exports.newReview = (req, res) => {
  if (
    !req.body.title ||
    !req.body.imdbID ||
    !req.body.reviewText ||
    !req.body.rating ||
    !req.body.userID
  ) {
    res.status(500).send({ message: "Missing fields" });
    return;
  }
  const newReview = new Review({
    title: req.body.title,
    imdbID: req.body.imdbID,
    reviewText: req.body.reviewText,
    rating: req.body.rating,
    likes: [],
  });

  newReview
    .save()
    .then((review) => {
      console.log("saved review");
      if (req.body.userID) {
        User.findOne({ _id: req.body.userID }).then((user) => {
          review.owner = user._id;
          review
            .save()
            .then(() => {
              res.send({ message: "success" });
            })
            .catch((err) => {
              res.status(500).send({ message: err });
              console.log(err);
            });
        });
      } else {
        res.status(500).send({ message: "Missing user ID" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      console.log(err);
    });
};

exports.getReview = (req, res) => {
  if (!req.params.id) {
    res.status(500).send({ message: "Missing ID of Review." });
    return;
  }
  Review.findOne({ _id: req.params.id })
    .then((review) => {
      res.send({ review: review });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      console.log(err);
    });
};

exports.getRecentReviews = (req, res) => {
  Review.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .then((reviews) => {
      res.send({ reviews: reviews });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      console.log(err);
    });
};

exports.getReviewsByMovieID = (req, res) => {
  if (!req.params.id) {
    res
      .status(500)
      .send({ message: "Missing ID of Movie to get Reviews for." });
    return;
  }
  Review.find({ imdbID: req.params.id })
    .then((reviews) => {
      res.send({ reviews: reviews });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      console.log(err);
    });
};

exports.likeReview = (req, res) => {
  const userID = req.body.userID;
  if (!userID || !req.params.id) {
    res.status(500).send({ message: "Missing fields" });
    return;
  }

  Review.findOne({ _id: req.params.id })
    .then((review) => {
      if (review.likes.includes(userID)) {
        review.likes = review.likes.filter((user) => user != userID);
      } else {
        review.likes.push(userID);
      }
      
      review
        .save()
        .then((review) => {
          res.send({ review: review });
        })
        .catch((err) => {
          res.status(500).send({ message: err });
          console.log(err);
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      console.log(err);
    });
};
