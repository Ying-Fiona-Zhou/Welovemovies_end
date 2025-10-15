const knex = require("../db/connection");

// /theaters -> 返回行，用 reduceProperties 聚合为 movies 数组（controller 里做）
function listWithMovies() {
  return knex("theaters as t")
    .leftJoin("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .leftJoin("movies as m", "mt.movie_id", "m.movie_id")
    .select(
      "t.theater_id",
      "t.name",
      "t.address_line_1",
      "t.address_line_2",
      "t.city",
      "t.state",
      "t.zip",
      "t.created_at",
      "t.updated_at",
      // movie fields
      "m.movie_id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url",
      "m.created_at as m_created_at",
      "m.updated_at as m_updated_at",
      "mt.is_showing",
      "mt.theater_id as mt_theater_id"
    )
    .orderBy("t.theater_id");
}

// /movies/:movieId/theaters -> 扁平列表（包含 is_showing, movie_id）
function listByMovie(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select(
      "t.theater_id",
      "t.name",
      "t.address_line_1",
      "t.address_line_2",
      "t.city",
      "t.state",
      "t.zip",
      "t.created_at",
      "t.updated_at",
      "mt.is_showing",
      "mt.movie_id"
    )
    .where({ "mt.movie_id": Number(movieId) });
}

module.exports = {
  listWithMovies,
  listByMovie,
};
