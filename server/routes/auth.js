const express = require("express");
const {Register,loginUser} = require("../controller/authController")
const Router = express.Router();

Router.post("/register",Register);
Router.post("/login",loginUser)

module.exports = Router;