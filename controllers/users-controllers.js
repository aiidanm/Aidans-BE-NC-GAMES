const {getAllUsers} = require("../models/users-models")

exports.fetchAllUsers = (req, res, next) => {
    getAllUsers().then((response) => {
        res.status(200).send({users: response.rows})
    })
}