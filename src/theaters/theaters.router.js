const router = require("express").Router({ mergeParams: true });
const controller = require("./theaters.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");


// Handles both /theaters and /movies/:movieId/theaters
router
  .route("/")
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;
