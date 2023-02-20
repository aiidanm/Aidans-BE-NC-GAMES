const express = require ('express')
const {fetchallCategories} = require("./controllers/categoryControllers")
const {fetchAllReviews} = require("./controllers/reviews-controllers")
const {handle500Errors} = require("./controllers/errorControllers")

const app = express()


app.get("/api/categories", fetchallCategories)

app.get("/api/reviews",fetchAllReviews)

app.use(handle500Errors)

module.exports = app


