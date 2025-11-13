const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");

// Configure reducer to nest movie fields under `movies` array for /theaters
const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  created_at: ["movies", null, "created_at"],
  updated_at: ["movies", null, "updated_at"],
  is_showing: ["movies", null, "is_showing"],
  theater_id: ["movies", null, "theater_id"],
});

async function list(request, response) {
  
   const { movieId } = request.params;

  // Case 1: /movies/:movieId/theaters
  if (movieId) {
    const data = await service.listByMovie(Number(movieId));
    return response.json({ data });
   }
  // Case 2: /theaters (with nested movies)
  const rows = await service.listWithMovies();
  const data = reduceMovies(rows);
  return response.json({ data });
}


module.exports = {
  list: asyncErrorBoundary(list),
};
