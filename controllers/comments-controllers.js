const { getReviewsComments } = require("../models/comments-models");
const { getReviewByID } = require("../models/review-models");

exports.fetchReviewsComments = (req, res, next) => {

  const { review_id } = req.params;

  const getCommentsPromise = getReviewsComments(review_id);
  const reviewCheckPromise = getReviewByID(review_id);
  
  Promise.all([reviewCheckPromise, getCommentsPromise])
    .then((data) => {
      const reviews = data[1].rows
      res.status(200).send({ comments: reviews });
    })
    .catch((error) => {
      next(error);
    });
};
