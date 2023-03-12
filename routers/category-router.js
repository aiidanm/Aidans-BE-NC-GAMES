const categoryRouter = require("express").Router()
const {fetchallCategories} = require("../controllers/categoryControllers") 



categoryRouter.get("/", fetchallCategories)

module.exports = categoryRouter;


