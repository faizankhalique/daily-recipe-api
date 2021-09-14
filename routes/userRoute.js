const express = require("express");
const auth = require("../middleware/auth");
const { userController } = require("../controllers");

const router = express.Router();

router.get("/user/:id", auth, userController.getUser);
router.put("/user", auth, userController.updateUser);
router.put("/user/change-password", auth, userController.changePassword);
module.exports = router;
