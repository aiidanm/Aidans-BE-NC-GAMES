const reviewRouter = require("express").Router();
const {
  fetchSingleReview,
  fetchAllReviews,
  patchReviewController,
  PostNewComment,
} = require("../controllers/reviews-controllers");

const {
  fetchReviewsComments,
  deleteCommentByIDController,
} = require("../controllers/comments-controllers");

reviewRouter.get("/", fetchAllReviews);

reviewRouter.get("/:review_id", fetchSingleReview);

reviewRouter.get("/:review_id/comments", fetchReviewsComments);

reviewRouter.patch("/:review_id", patchReviewController);

reviewRouter.post("/:review_id/comments", PostNewComment);

module.exports = reviewRouter;
