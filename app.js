const express = require ('express')
const {fetchallCategories} = require("./controllers/categoryControllers")
const {fetchAllReviews, PostNewComment} = require("./controllers/reviews-controllers")
const {handle500Errors, handle404Errors} = require("./controllers/errorControllers")

const app = express()
app.use(express.json())

app.get("/api/categories", fetchallCategories)

app.get("/api/reviews",fetchAllReviews)

app.post("/api/reviews/:review_id/comments",PostNewComment )

app.use(handle500Errors)

app.all("/*", handle404Errors)

module.exports = app


