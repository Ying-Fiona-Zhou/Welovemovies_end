// src/reviews/reviews.service.js
const db = require("../db/connection");
const tableName = "reviews";

// 删除一条评论
function destroy(reviewId) {
  return db(tableName).where({ review_id: Number(reviewId) }).del();
}

// 读取单条评论（不带 critic）
function read(reviewId) {
  return db(tableName).select("*").where({ review_id: Number(reviewId) }).first();
}

// 读取 critic
function readCritic(critic_id) {
  return db("critics").where({ critic_id: Number(critic_id) }).first();
}

// 给 review 嵌套 critic
async function setCritic(review) {
  if (!review) return review;
  review.critic = await readCritic(review.critic_id);
  return review;
}

// 更新评论（只需确保返回带 critic 的完整对象）
async function update(review) {
  // 只更新允许的字段，并刷新 updated_at
  const patch = {
    content: review.content,
    score: review.score,
    updated_at: db.fn.now(),
  };

  await db(tableName).where({ review_id: Number(review.review_id) }).update(patch);

  // 返回带 critic 的完整对象
  return readWithCritic(review.review_id);
}

/**
 * 列出某电影的所有评论（每条嵌套 critic）
 * 符合 GET /movies/:movieId/reviews 的返回结构
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
 * 读取单条评论并嵌套 critic
 * 符合 PUT /reviews/:reviewId 的返回结构
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

// 为了兼容你之前的接口名，这里把 list 定义为别名；测试会调用 listByMovieId
function list(movie_id) {
  return listByMovieId(movie_id);
}

module.exports = {
  destroy,
  list,            // 兼容你原来的控制器
  listByMovieId,   // 满足测试
  read,
  readWithCritic,  // 满足测试（PUT 返回）
  update,
};
