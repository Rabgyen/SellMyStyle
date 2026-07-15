const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello")
})

const userRouter = require('./routes/userRoutes')

app.use(userRouter)

app.listen(5000, () => {
    console.log("Server is running!");
});