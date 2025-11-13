// src/reviews/reviews.service.js
const db = require("../db/connection");
const tableName = "reviews";

// delete a review
function destroy(reviewId) {
  return db(tableName).where({ review_id: Number(reviewId) }).del();
}

// Read a single review (without the critic details)
function read(reviewId) {
  return db(tableName).select("*").where({ review_id: Number(reviewId) }).first();
}

// read critic
function readCritic(critic_id) {
  return db("critics").where({ critic_id: Number(critic_id) }).first();
}

// Nest critic details into the review object
async function setCritic(review) {
  if (!review) return review;
  review.critic = await readCritic(review.critic_id);
  return review;
}

// Update the review (must ensure the complete object with nested critic is returned)
async function update(review) {
  // Only update allowed fields and refresh the updated_at timestamp
  const patch = {
    content: review.content,
    score: review.score,
    updated_at: db.fn.now(),
  };

  await db(tableName).where({ review_id: Number(review.review_id) }).update(patch);

  // Return the complete object with nested critic details
  return readWithCritic(review.review_id);
}

/**
 * Lists all reviews for a movie (with nested critic details for each)
 * Matches the required return structure for GET /movies/:movieId/reviews
 */
function listByMovieId(movie_id) {
  return db("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.created_at",
      "r.updated_at",
      "r.critic_id",
      "r.movie_id",
      "c.critic_id as c_critic_id",
      "c.preferred_name as c_preferred_name",
      "c.surname as c_surname",
      "c.organization_name as c_organization_name",
      "c.created_at as c_created_at",
      "c.updated_at as c_updated_at"
    )
    .where({ "r.movie_id": Number(movie_id) })
    .then(rows =>
      rows.map((row) => ({
        review_id: row.review_id,
        content: row.content,
        score: row.score,
        created_at: row.created_at,
        updated_at: row.updated_at,
        critic_id: row.critic_id,
        movie_id: row.movie_id,
        critic: {
          critic_id: row.c_critic_id,
          preferred_name: row.c_preferred_name,
          surname: row.c_surname,
          organization_name: row.c_organization_name,
          created_at: row.c_created_at,
          updated_at: row.c_updated_at,
        },
      }))
    );
}

/**
 * Reads a single review and nests the critic details
 * Matches the required return structure for PUT /reviews/:reviewId
 */
async function readWithCritic(reviewId) {
  const row = await db("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.created_at",
      "r.updated_at",
      "r.critic_id",
      "r.movie_id",
      "c.critic_id as c_critic_id",
      "c.preferred_name as c_preferred_name",
      "c.surname as c_surname",
      "c.organization_name as c_organization_name",
      "c.created_at as c_created_at",
      "c.updated_at as c_updated_at"
    )
    .where({ "r.review_id": Number(reviewId) })
    .first();

  if (!row) return undefined;

  return {
    review_id: row.review_id,
    content: row.content,
    score: row.score,
    created_at: row.created_at,
    updated_at: row.updated_at,
    critic_id: row.critic_id,
    movie_id: row.movie_id,
    critic: {
      critic_id: row.c_critic_id,
      preferred_name: row.c_preferred_name,
      surname: row.c_surname,
      organization_name: row.c_organization_name,
      created_at: row.c_created_at,
      updated_at: row.c_updated_at,
    },
  };
}

// For compatibility with your previous controller's name, 'list' is an alias; tests will call listByMovieId
function list(movie_id) {
  return listByMovieId(movie_id);
}

module.exports = {
  destroy,
  list,            // For controller compatibility
  listByMovieId,   // For testing
  read,
  readWithCritic,  // For testing (PUT return value)
  update,
};
