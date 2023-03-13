const {getAllUsers, getUsername} = require("../models/users-models")

exports.fetchAllUsers = (req, res, next) => {
    getAllUsers().then((response) => {
        res.status(200).send({users: response.rows})
    })
}

exports.fetchUsername = (req, res, next) => {
    getUsername(req.params.username).then((response) => {
        res.status(200).send({user: response.rows})
    })
}