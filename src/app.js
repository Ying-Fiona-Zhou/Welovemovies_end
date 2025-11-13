
const { TextEncoder, TextDecoder } = require("util");
if (typeof global.TextEncoder === "undefined") global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === "undefined") global.TextDecoder = TextDecoder;

// Only load .env during local development (common practice in Thinkful templates)
if (process.env.USER) require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Sub-routers
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

// Error middleware
const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");

// Global middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the WeLoveMovies API 🎬",
    endpoints: ["/movies", "/theaters", "/reviews"]
  });
});

// Optional: Prevent /favicon.ico warnings
app.get("/favicon.ico", (req, res) => res.status(204).end());


// Top-level route mounting
app.use("/movies", moviesRouter);     // /movies, /movies/:movieId, /movies/:movieId/reviews, /movies/:movieId/theaters
app.use("/reviews", reviewsRouter);   // PUT/DELETE /reviews/:reviewId
app.use("/theaters", theatersRouter); // GET /theaters

// 404 & Unified error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
