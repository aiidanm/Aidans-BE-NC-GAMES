const db = require("../db/connection");

exports.getAllReviews = (queries, allowedCategories) => {
  if (queries.sort_by === undefined) {
    queries.sort_by = "created_at";
  }

  if (queries.order_by === undefined) {
    queries.order_by = "DESC";
  }

  if (
    queries.category !== undefined &&
    isNaN(Number(queries.category)) === false
  ) {
    return Promise.reject("category is invalid type");
  }
  if (isNaN(Number(queries.sort_by)) === false) {
    return Promise.reject("sort by is invalid type");
  }

  const allowedOrders = ["ASC", "DESC"];
  const allowedSorts = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "created_at",
    "votes",
    "review_body",
    "review_img_url",
  ];

  if (
    !allowedCategories.includes(queries.category) &&
    queries.category !== undefined
  ) {
    return Promise.reject("category provided is not in array");
  }

  if (!allowedOrders.includes(queries.order_by)) {
    return Promise.reject("order by provided is not in array");
  }

  if (!allowedSorts.includes(queries.sort_by)) {
    return Promise.reject("sort by provided is not in array");
  }

  let queryString = `
  SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id)::int AS "comment_count"
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id`;

  if (queries.category === undefined) {
    queryString += ` GROUP BY reviews.review_id ORDER BY ${queries.sort_by} ${queries.order_by};`;
  } else {
    queryString += ` WHERE reviews.category = '${queries.category}' GROUP BY reviews.review_id ORDER BY ${queries.sort_by} ${queries.order_by};`;
  }
  return db.query(queryString);
};

exports.getReviewByID = (inputId) => {
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

exports.patchReviewModel = (review_id, body) => {
  if (body.hasOwnProperty("inc_votes") === false) {
    return Promise.reject("no inc_vote");
  } else if (typeof body.inc_votes !== "number") {
    return Promise.reject("inc votes needs to be a number");
  } else {
    const voteAmount = body.inc_votes;
    return db
      .query(
        `
    UPDATE reviews
    SET votes = VOTES + $1
    WHERE review_id = $2
    RETURNING *;
  `,
        [voteAmount, review_id]
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

exports.getReviewCategories = () => {
  return db.query(`SELECT DISTINCT category FROM reviews;`);
};

exports.getCategorybyName = (category_name) => {
  if (isNaN(Number(category_name)) === false) {
    return Promise.reject("category is invalid type");
  } else {
    return db.query(
      `SELECT DISTINCT category FROM reviews WHERE category = $1`,
      [category_name]
    );
  }
};
