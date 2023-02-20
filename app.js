const express = require ('express')
const {fetchallCategories} = require("./controllers/categoryControllers")

const app = express()

app.get("/api/categories", fetchallCategories)

module.exports = app


