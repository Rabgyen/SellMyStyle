const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const db = require("./config/db");
const { deactivateExpiredDiscounts } = require("./controllers/productController");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded profile pictures as static files
// e.g. GET http://localhost:5000/uploads/avatar_7_1234567890.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.send("Hello");
});

const userRouter = require("./routes/userRoutes");
const sellerRouter = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes")

app.use(userRouter);
app.use("/api/seller", sellerRouter);
app.use("/product/", productRoutes)

const deactivateExpiredDiscountsSafely = async () => {
    try {
        await deactivateExpiredDiscounts();
    } catch (error) {
        console.error("Unable to deactivate expired discounts:", error.message);
    }
};

// Keep the database state correct even when no product page is being viewed.
deactivateExpiredDiscountsSafely();
setInterval(deactivateExpiredDiscountsSafely, 60 * 60 * 1000).unref();

app.listen(5000, () => {
    console.log("Server is running!");
});
