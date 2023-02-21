const db = require("../db/connection")


exports.PostComment = (review_id, comment) => {
    return db.query(`
        INSERT INTO comments
            (body, votes, author, review_id, created_at)
        VALUES
            ($1, 0, $2, $3, CURRENT_TIMESTAMP)
            RETURNING *;
    `, [comment.body,comment.username, review_id])
}