const { getAllReviews } = require("../models/review-models");

exports.fetchAllReviews = (req, res, next) => {
  getAllReviews()
    .then((reviews) => {
      res.status(200).send({ reviews: reviews.rows });
    })
    .catch((error) => {
      next(error);
    });
};

