const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  // TODO: Write your code here
  const { reviewId } = request.params;
  const review = await service.read(Number(reviewId));
  if (review) {
    response.locals.review = review;
    return next();
  }

  return next({ status: 404, message: "Review cannot be found." });
}

// DELETE /reviews/:reviewId  -> 204 No Content
async function destroy(request, response) {
  // TODO: Write your code here
  await service.destroy(response.locals.review.review_id);
  return response.sendStatus(204);

}

// GET /movies/:movieId/reviews  (must return critic nested under `critic`)
async function list(request, response) {
  // TODO: Write your code here
  const { movieId } = request.params;
  const data = await service.listByMovieId(Number(movieId)); // should include critic nested
  return response.json({ data });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) return next();
  return methodNotAllowed(request, response, next);
}


function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

// PUT /reviews/:reviewId 
async function update(request, response) {
  // TODO: Write your code here
   // 合并旧记录 + 新数据；只更新传入的字段
  const updatedReview = {
    ...response.locals.review,
    ...request.body.data, // 允许部分更新 { score, content }
    review_id: response.locals.review.review_id,
  };

  await service.update(updatedReview);

  // 返回带 critic 嵌套的完整对象
  const data = await service.readWithCritic(updatedReview.review_id);
  return response.json({ data });

}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
