const express = require("express");
const { fetchallCategories } = require("./controllers/categoryControllers");
const {
  fetchSingleReview,
  fetchAllReviews
} = require("./controllers/reviews-controllers");
const {
  handleIncorrectEndpointErrors,
  handle400Errors,
  handle500Errors,
  handleIncorrectReviewID
} = require("./controllers/errorControllers");

const {fetchAllUsers} = require("./controllers/users-controllers")

const { fetchReviewsComments } = require("./controllers/comments-controllers");

const app = express();

app.get("/api/categories", fetchallCategories);

app.get("/api/reviews", fetchAllReviews);

app.get("/api/reviews/:review_id", fetchSingleReview);

app.get("/api/reviews/:review_id/comments",fetchReviewsComments)

app.get("/api/users", fetchAllUsers)

app.all("*", handleIncorrectEndpointErrors)

app.use(handle400Errors)

app.use(handleIncorrectReviewID);

app.use(handle500Errors);

module.exports = app;
