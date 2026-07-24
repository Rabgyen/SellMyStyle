const express = require("express");
const router = express.Router();

const { registerSeller } = require("../controllers/sellerController");
const { uploadFields } = require("../middleware/sellerUpload");

router.post(
    "/register",
    uploadFields,
    registerSeller
);

module.exports = router;
