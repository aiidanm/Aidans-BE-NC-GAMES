const express = require ('express')
const {fetchallCategories} = require("./controllers/categoryControllers")
const {handle500Errors} = require("./controllers/errorControllers")

const app = express()

app.get("/api/categories", fetchallCategories)

app.use(handle500Errors)

module.exports = app


