exports.handleIncorrectEndpointErrors = (req, res, next) => {
  res.status(404).send({ msg: "incorrect endpoint" });
};


exports.handle500Errors = (error, req, res, next) => {
  if (error.status === 500) {
    res.status(500).send({ msg: "Server Error" });
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, req, res, next) => {
   if (error === "id provided is not a number") { 
    res.status(400).send({ msg: "bad request" });
  } else if (error.msg === "id does not exist") { 
    res.status(404).send({ msg: "review id does not exist" });
  } else if (error === "no inc_vote"){
    res.status(400).send({msg: "you need to provide a inc_votes object"})
  } else if (error === "inc votes needs to be a number"){
    res.status(400).send({msg: "need to provide a number"})
  }
  else {
    next(error);
  }
}