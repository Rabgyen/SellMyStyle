const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const db = require("./config/db");

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

app.use(userRouter);
app.use("/api/seller", sellerRouter);

app.listen(5000, () => {
    console.log("Server is running!");
});