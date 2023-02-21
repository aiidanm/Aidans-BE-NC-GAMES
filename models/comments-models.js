const db = require("../db/connection");

exports.getReviewsComments = (review_id) => {
    return db
      .query(
        `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
        [review_id]
      )
};

