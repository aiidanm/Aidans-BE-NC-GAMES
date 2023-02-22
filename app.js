const express = require("express");
const { fetchallCategories } = require("./controllers/categoryControllers");
const {
  fetchSingleReview,
  fetchAllReviews,
  patchReviewController,
} = require("./controllers/reviews-controllers");
const {
  handleIncorrectEndpointErrors,
  handle500Errors,
  handleCustomErrors
} = require("./controllers/errorControllers");

const { fetchReviewsComments } = require("./controllers/comments-controllers");

const app = express();

app.use(express.json())

app.get("/api/categories", fetchallCategories);

app.get("/api/reviews", fetchAllReviews);

app.get("/api/reviews/:review_id", fetchSingleReview);

app.get("/api/reviews/:review_id/comments",fetchReviewsComments)

app.patch("/api/reviews/:review_id", patchReviewController)

app.all("*", handleIncorrectEndpointErrors)

app.use(handleCustomErrors)

app.use(handle500Errors);

module.exports = app;
