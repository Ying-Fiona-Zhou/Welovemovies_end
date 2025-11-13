const router = require("express").Router({ mergeParams: true });
const controller = require("./reviews.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");


// /movies/:movieId/reviews
router.route("/")
  .get(controller.list)
  .all(methodNotAllowed);

// /reviews/:reviewId
router.route("/:reviewId")
  .put(controller.update)
  .delete(controller.destroy)
  .all(methodNotAllowed);

module.exports = router;
