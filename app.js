
const express = require("express");
const { fetchallCategories } = require("./controllers/categoryControllers");
const {
  fetchAllReviews,
  fetchSingleReview,
  PostNewComment
} = require("./controllers/reviews-controllers");
const {
  handleIncorrectEndpointErrors,
  handleIncorrectReviewID,
  handle400Errors,
  handle500Errors,
  handle404Errors
} = require("./controllers/errorControllers");

const app = express();

app.use(express.json())


app.get("/api/categories", fetchallCategories);

app.get("/api/reviews", fetchAllReviews);

app.get("/api/reviews/:review_id", fetchSingleReview);

app.post("/api/reviews/:review_id/comments",PostNewComment )


app.all("*", handleIncorrectEndpointErrors)

app.use(handleIncorrectReviewID);
app.use(handle400Errors);
app.use(handle500Errors);

module.exports = app;
