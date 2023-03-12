const userRouter = require("express").Router();
const {fetchAllUsers} = require("../controllers/users-controllers")

userRouter.get(`/`, fetchAllUsers);



module.exports = userRouter;
