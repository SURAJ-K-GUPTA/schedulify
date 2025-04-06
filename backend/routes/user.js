const express = require("express");
const { registerController, loginController, userDetailsController } = require("../controllers/user");
const verifyToken = require("../utils/auth");


const userRouter = express.Router();

userRouter.get("/user",verifyToken ,userDetailsController);
userRouter.post("/register",registerController );


userRouter.post("/login", loginController);


module.exports = userRouter;
