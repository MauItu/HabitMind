const express = require("express");
const AuthController = require("../controller/authController");
const router = express.Router();

router.post("/signIn", AuthController.signIn);
router.post("/signUp", AuthController.signUp);

module.exports = router;