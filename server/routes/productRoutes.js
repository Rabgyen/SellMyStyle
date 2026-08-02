const express = require("express");
const router = express.Router();
const { getProductCategory, addProduct, getProductById, updateProduct, getProduct } = require("../controllers/productController");
const { upload } = require("../middleware/sellerUpload");

router.get("/product_categories", getProductCategory);
router.get("/products", getProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.post("/:sellerId/products", upload.array("images", 10), addProduct);

module.exports = router;
