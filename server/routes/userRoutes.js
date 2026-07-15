const express = require("express");

const router = express.Router();

const {
    signUpUser
} = require("../controllers/userController");
const {
    loginUser
} = require("../controllers/userController");

router.post("/signup", signUpUser);

router.post("/login", loginUser)

module.exports = router;