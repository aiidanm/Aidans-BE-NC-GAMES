exports.handle500Errors = (error, req, res, next) => {
    console.log(error)
    res.status(500).send({msg: "Server Error"})
}