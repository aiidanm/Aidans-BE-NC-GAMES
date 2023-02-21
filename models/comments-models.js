const db = require("../db/connection");

exports.getReviewsComments = (review_id) => {
  if (isNaN(Number(review_id)) === true) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    return db
      .query(
        `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
        [review_id]
      )
      .then((response) => {
        const arr = response.rows;
        if (arr.length === 0) {
          return Promise.reject({ status: 404, msg: "id does not exist" });
        } else {
          return response;
        }
      });
  }
};
