const userRouter = require("express").Router();
const {fetchAllUsers, fetchUsername} = require("../controllers/users-controllers")

userRouter.get(`/`, fetchAllUsers);

userRouter.get(`/:username`, fetchUsername)


module.exports = userRouter;
