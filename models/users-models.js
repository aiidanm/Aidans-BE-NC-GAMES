const db = require("../db/connection")

exports.getAllUsers = () => {
    return db.query(`
    SELECT * FROM users;
    `)
}