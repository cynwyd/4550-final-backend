const controller = require("../controllers/movie.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/movie/get/t", controller.getMovieByTitle);

  app.get("/api/movie/get/id", controller.getMovieByID);

  app.get("/api/movie/search/s", controller.searchMoviesByTitle);
};