// src/movies/movies.service.js
const db = require("../db/connection");

// All moives
function list() {
  return db("movies").select("*");
}

// Currently showing movies (deduplicated, to prevent a single movie from being listed multiple times from different theaters)
function listShowing() {
  return db("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where({ "mt.is_showing": true })
    .select("m.*")
    .distinct();
}

// Single movie
function read(movieId) {
  return db("movies")
    .select("*")
    .where({ movie_id: movieId })
    .first();
}

module.exports = {
  list,
  listShowing,
  read,
};
