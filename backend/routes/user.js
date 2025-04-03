const express = require("express");
const { registerController, loginController } = require("../controllers/user");


const userRouter = express.Router();

userRouter.post("/register",registerController );


userRouter.post("/login", loginController);


module.exports = userRouter;
