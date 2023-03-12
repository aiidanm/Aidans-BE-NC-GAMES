const commentRouter = require("express").Router()
const  {deleteCommentByIDController} = require("../controllers/comments-controllers")

commentRouter.delete("/:comment_id", deleteCommentByIDController)

module.exports = commentRouter