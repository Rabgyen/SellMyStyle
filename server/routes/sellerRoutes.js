const express = require("express");
const router = express.Router();

const { registerSeller, getSellerProducts, getSellerCollections, getSellerProfile } = require("../controllers/sellerController");
const { uploadFields } = require("../middleware/sellerUpload");

router.post(
    "/register",
    uploadFields,
    registerSeller
);
router.get("/:sellerId/products", getSellerProducts);
router.get("/:sellerId/collections", getSellerCollections);
router.get("/profile/:sellerId", getSellerProfile);

module.exports = router;
