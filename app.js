const express = require("express");
const { fetchallCategories } = require("./controllers/categoryControllers");
const {
  fetchAllReviews,
  fetchSingleReview,
} = require("./controllers/reviews-controllers");
const {
  handle500Errors,
  handleIncorrectEndpointErrors,
  handleIncorrectReviewID,
  handle400Errors,
} = require("./controllers/errorControllers");

const app = express();

app.get("/api/categories", fetchallCategories);

app.get("/api/reviews", fetchAllReviews);

app.get("/api/reviews/:review_id", fetchSingleReview);

app.all("/*", handleIncorrectEndpointErrors);

app.use(handle500Errors);
app.use(handleIncorrectReviewID);
app.use(handle400Errors);

module.exports = app;
