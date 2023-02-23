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
  if (error.code === "23503") {
    res.status(404).send({ msg: "username not correct" });
  } else if (error === "body is not a string") {
    res.status(400).send({ msg: "body needs to be a string" });
  } else if (error === "body needs correct keys") {
    res
      .status(400)
      .send({ msg: "comment needs to contain a username and body" });
  } else if (error === "id provided is not a number") {
    res.status(400).send({ msg: "bad request" });
  } else if (error.msg === "id does not exist") {
    res.status(404).send({ msg: "review id does not exist" });
  } else if (error === "no inc_vote") {
    res.status(400).send({ msg: "you need to provide a inc_votes object" });
  } else if (error === "inc votes needs to be a number") {
    res.status(400).send({ msg: "need to provide a number" });
  } else {
    next(error);
  }
};

exports.handleQueryErrors = (error, req, res, next) => {
  if (error === "category provided is not in array"){
    res.status(404).send({msg: "invalid category provided"})
  } else if (error === "sort by provided is not in array"){
    res.status(400).send({msg: "invalid sort_by provided"})
  } else if (error === "order by provided is not in array"){
    res.status(400).send({msg: "order by should be ASC or DESC"})
  } 
  
  else if (error === "category is invalid type"){
    res.status(400).send({msg: "category needs to be a string"})
  } else if (error === "sort by is invalid type"){
    res.status(400).send({msg: "sort by needs to be a string"})
  } else {
    next(error)
  }
}