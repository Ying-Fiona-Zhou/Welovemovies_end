const router = require("express").Router({ mergeParams: true });
const controller = require("./theaters.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Add your routes here
// Handles both /theaters and /movies/:movieId/theaters
router
  .route("/")
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;
