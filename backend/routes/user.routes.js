const { Router } = require("express");
const { login, register } = require("../controller/user.controller.js");

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);

module.exports =  router;
