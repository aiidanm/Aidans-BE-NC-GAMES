const db = require("../db/connection")

exports.getAllUsers = () => {
    return db.query(`
    SELECT * FROM users;
    `)
}

exports.getUsername = (username) => {
    const validUsernames = []
    return db.query(`SELECT username FROM users WHERE username IS mallionaire`)

    
}

