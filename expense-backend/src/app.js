const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

const authRoute = require("./routes/auth.route");
const typeRoute = require("./routes/type.route");
const categoryRoute = require("./routes/category.route");
const transactionRoute = require("./routes/transaction.route");

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Expense API is running",
    });
});

app.use("/api/auth", authRoute);
app.use("/api/types", typeRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/transactions", transactionRoute);

module.exports = app;