const db = require("../db/connection");

exports.getAllReviews = () => {
  return db.query(`
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id)::int AS "comment_count"
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;
  `);
};

exports.getReviewByID = (inputId) => {
  if (isNaN(Number(inputId)) === true) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    return db
      .query(
        `
    SELECT * FROM reviews 
    WHERE review_id = $1
    `,
        [inputId]
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
