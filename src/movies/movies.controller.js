const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// check :movieId if exist
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(Number(movieId));
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: "Movie cannot be found." });
}

// GET /movies/:movieId
async function read(req, res) {
  return res.json({ data: res.locals.movie });
}

// GET /movies  (支持 ?is_showing=true)
async function list(req, res) {
  const { is_showing } = req.query;

  if (is_showing === "true") {
    const data = await service.listShowing();
    return res.json({ data });
  }

  const data = await service.list();
  return res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  // // Export this middleware if child routes need to validate the existence of a movie.
  movieExists: [asyncErrorBoundary(movieExists)],
};
