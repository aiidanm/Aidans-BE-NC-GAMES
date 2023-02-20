const {getAllCategories} = require("../models/categoryModels")

exports.fetchallCategories = (req, res, next) => {
    getAllCategories()
        .then((categories) => {
            res.status(200).send(categories.rows)
         })
}