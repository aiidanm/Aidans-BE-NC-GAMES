const express = require("express");
const fs = require("fs/promises");

const {
  handleIncorrectEndpointErrors,
  handle500Errors,
  handleCustomErrors,
  handleQueryErrors,
  handlePSQLErrors,
} = require("./controllers/errorControllers");

const { fetchAllUsers } = require("./controllers/users-controllers");

const {
  fetchReviewsComments,
  deleteCommentByIDController,
} = require("./controllers/comments-controllers");

const apiRouter = require("./routers/api-router");
const userRouter = require("./routers/users-router");
const categoryRouter = require("./routers/category-router");
const reviewRouter = require("./routers/reviews-router");
const commentRouter = require("./routers/comment-router")

const app = express();
app.use(express.json());

app.use(`/api`, apiRouter);

app.use(`/api/users`, userRouter);

app.use(`/api/categories`, categoryRouter);

app.use(`/api/reviews`, reviewRouter);

app.use("/api/comments", commentRouter);

app.all("*", handleIncorrectEndpointErrors);

app.use(handleQueryErrors);
app.use(handlePSQLErrors);

app.use(handleQueryErrors);

app.use(handleCustomErrors);

app.use(handle500Errors);

module.exports = app;
