const db = require("../db/connection");

exports.PostComment = (review_id, comment) => {
  if (!comment.hasOwnProperty("body")||  !comment.hasOwnProperty("username"))
   {
    return Promise.reject("body needs correct keys");
  } else if (typeof comment.body !== "string") {
    return Promise.reject("body is not a string");
  } else {
    return db.query(
      `
        INSERT INTO comments
            (body, votes, author, review_id, created_at)
        VALUES
            ($1, 0, $2, $3, CURRENT_TIMESTAMP)
            RETURNING *;
    `,
      [comment.body, comment.username, review_id]
    );
  }
};

exports.getReviewsComments = (review_id) => {
  return db.query(
    `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
    [review_id]
  );
};
