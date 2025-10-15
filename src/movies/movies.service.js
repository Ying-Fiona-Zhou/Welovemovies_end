// src/movies/movies.service.js
const db = require("../db/connection");

// 所有电影
function list() {
  return db("movies").select("*");
}

// 正在上映的电影（去重，避免同片在多个影院重复）
function listShowing() {
  return db("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where({ "mt.is_showing": true })
    .select("m.*")
    .distinct();
}

// 单个电影
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
