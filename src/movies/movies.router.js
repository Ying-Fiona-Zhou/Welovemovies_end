const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const reviewsRouter = require("../reviews/reviews.router");
const theatersRouter = require("../theaters/theaters.router");


// /movies
router
  .route("/")
  .get(controller.list)
  .all(methodNotAllowed);

// /movies/:movieId
router
  .route("/:movieId")
  .get(controller.read)
  .all(methodNotAllowed);

// /movies/:movieId/reviews
router.use("/:movieId/reviews", reviewsRouter);

// /movies/:movieId/theaters
router.use("/:movieId/theaters", theatersRouter);

module.exports = router;
