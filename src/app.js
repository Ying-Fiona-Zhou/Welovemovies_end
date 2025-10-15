// 仅在本地开发时加载 .env（Thinkful 模板常用）
if (process.env.USER) require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// 子路由
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

// 错误中间件
const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");

// 全局中间件
app.use(cors());
app.use(express.json());

// 顶级路由挂载
app.use("/movies", moviesRouter);     // /movies, /movies/:movieId, /movies/:movieId/reviews, /movies/:movieId/theaters
app.use("/reviews", reviewsRouter);   // PUT/DELETE /reviews/:reviewId
app.use("/theaters", theatersRouter); // GET /theaters

// 404 & 统一错误处理
app.use(notFound);
app.use(errorHandler);

module.exports = app;
