const { authJwt } = require("../middlewares");
const controller = require("../controllers/review.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/review/recent", controller.getRecentReviews);

  app.get("/api/review/movie/:id", controller.getReviewsByMovieID);

  app.get("/api/review/:id", controller.getReview);

  app.put("/api/review/:id/like", controller.likeReview);

  app.post("/api/review/new", controller.newReview);
};