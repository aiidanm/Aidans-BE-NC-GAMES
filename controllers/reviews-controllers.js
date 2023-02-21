const { getAllReviews } = require("../models/review-models");
const { PostComment } = require("../models/comments-models");
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

  PostComment(review_id, comment).then((response) => {
    const comment = response.rows[0];
    res.status(201).send({ comment });
  });
};

// const ReviewPromise = getReviewByID(review_id);
// const postCommentPromise = PostComment(review_id, comment);

// Promise.all([ReviewPromise, postCommentPromise])
//   .then((response) => {

//   })
//   .catch((error) => {
//     next(error);
//   });
