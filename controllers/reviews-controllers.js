const { getAllReviews, getReviewByID } = require("../models/review-models");

exports.fetchAllReviews = (req, res, next) => {
  getAllReviews()
    .then((reviews) => {
      res.status(200).send({ reviews: reviews.rows });
    })
    .catch((error) => {
      next(error);
    });
};

exports.fetchSingleReview = (req, res, next) => {
  const { review_id } = req.params;

  getReviewByID(review_id)
    .then((response) => {
      res.status(200).send({ review: response.rows });
    })
    .catch((error) => {
      next(error);
    });
};
