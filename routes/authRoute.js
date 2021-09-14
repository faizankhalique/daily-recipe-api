const express = require("express");
const { loginController } = require("../controllers");

const router = express.Router();

router.post("/auth/login", loginController.login);
router.post("/auth/signup", loginController.createUser);
module.exports = router;
