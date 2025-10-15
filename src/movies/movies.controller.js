const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// 检查 :movieId 是否存在
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
  // 若子路由需要验证 movie 是否存在，可以导出该中间件：
  movieExists: [asyncErrorBoundary(movieExists)],
};
