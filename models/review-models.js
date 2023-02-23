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
    return Promise.reject("id provided is not a number");
  } else {
    return db
      .query(
        `
    SELECT reviews.review_id, title, category, designer, owner, review_body, review_img_url,reviews.created_at, reviews.votes, COUNT(comments.review_id)::int AS "comment_count"
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;
    `,
        [inputId]
      )
      .then((response) => {
        const arr = response.rows;
        if (arr.length === 0) {
          return Promise.reject({ status: 404, msg: "id does not exist" });
        } else {
          return response.rows[0];
        }
      });
  }
};

exports.patchReviewModel = (review_id, body) => {
  if(body.hasOwnProperty("inc_votes") === false ){
    return Promise.reject("no inc_vote")
  } else if (typeof body.inc_votes !== "number"){
    return Promise.reject("inc votes needs to be a number")
  } else {
    const voteAmount = body.inc_votes;
  return db.query(`
    UPDATE reviews
    SET votes = VOTES + $1
    WHERE review_id = $2
    RETURNING *;
  `, [voteAmount, review_id]).then((response) => {
    const arr = response.rows
    if (arr.length === 0){
      return Promise.reject({ status: 404, msg: "id does not exist" });
    } else {
      return response.rows[0]
    }
  })
  }
  
}