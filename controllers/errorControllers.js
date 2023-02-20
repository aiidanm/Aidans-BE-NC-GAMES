exports.handle500Errors = (error, req, res, next) => {
    console.log(error)
    res.status(500).send({msg: "Server Error"})
}

exports.handle404Errors = (error, req, res, next) => {
    res.status(404).send({msg: "incorrect endpoint"})
}