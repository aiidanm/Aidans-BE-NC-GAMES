
const express = require("express");
const { fetchallCategories } = require("./controllers/categoryControllers");
const {
  fetchSingleReview,
  PostNewComment,
  fetchAllReviews,
} = require("./controllers/reviews-controllers");
const {
  handleIncorrectEndpointErrors,
  handle400Errors,
  handle500Errors,
  handleIncorrectReviewID,
  handleIncorrectUsername,
} = require("./controllers/errorControllers");

const { fetchReviewsComments } = require("./controllers/comments-controllers");

const app = express();
app.use(express.json())


app.get("/api/categories", fetchallCategories);

app.get("/api/reviews", fetchAllReviews);

app.get("/api/reviews/:review_id", fetchSingleReview);

app.get("/api/reviews/:review_id/comments",fetchReviewsComments)

app.post("/api/reviews/:review_id/comments",PostNewComment)

app.all("*", handleIncorrectEndpointErrors)

app.use(handle400Errors)

app.use(handleIncorrectUsername)

app.use(handleIncorrectReviewID);

app.use(handle500Errors);

module.exports = app;
