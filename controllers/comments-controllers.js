const { getReviewsComments } = require("../models/comments-models");

exports.fetchReviewsComments = (req, res, next) => {
  const { review_id } = req.params;
  getReviewsComments(review_id).then((data) => {
    const reviews = data.rows
    res.status(200).send({comments: reviews});
  });
};
