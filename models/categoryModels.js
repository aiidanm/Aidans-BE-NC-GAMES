const db = require("../db/connection")

exports.getAllCategories = () => {
    return db.query(`SELECT * FROM categories;`)
}