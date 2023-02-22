
const { PostComment } = require("../models/comments-models");

const { getAllReviews, getReviewByID, patchReviewModel } = require("../models/review-models");

exports.fetchAllReviews = (req, res, next) => {
  getAllReviews()
    .then((reviews) => {
      res.status(200).send({ reviews: reviews.rows });
    })
    .catch((error) => {
      next(error);
    });
};

exports.PostNewComment = (req, res, next) => {
  const { review_id } = req.params;
  const comment = req.body;

  const ReviewPromise = getReviewByID(review_id);
  const postCommentPromise = PostComment(review_id, comment);

  Promise.all([ReviewPromise, postCommentPromise])
    .then((response) => {
      const comment = response[1].rows[0];
      res.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.fetchSingleReview = (req, res, next) => {
  const { review_id } = req.params;

  getReviewByID(review_id)
    .then((response) => {
      res.status(200).send({ review: response });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchReviewController = (req, res, next) => {
  const { review_id } = req.params;
  const body = req.body;
  const patchPromise = patchReviewModel(review_id, body);
  const reviewIDPromise = getReviewByID(review_id);
  
  Promise.all([reviewIDPromise, patchPromise])
    .then((response) => {
      const review = response[1]
      res.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};
