exports.handleIncorrectEndpointErrors = (req, res, next) => {
    res.status(404).send({ msg: "incorrect endpoint" });
};
exports.handleIncorrectReviewID = (error, req, res, next) => {
    if (error.status === 404) {
        res.status(404).send({ msg: "review id does not exist" });
    } else {
        next(error);
    }
};


exports.handle400Errors = (error, req, res, next) => {
    if (error === "id provided is not a number") {
        console.log(error.msg);
        res.status(400).send({ msg: "bad request" });
    } else {
        next(error);
    }
};
exports.handle500Errors = (error, req, res, next) => {
  if (error.status === 500) {
    res.status(500).send({ msg: "Server Error" });
  } else {
    next(error);
  }
};
