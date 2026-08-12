const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://hub-cashflow.smartdorm-biwboong.shop",
    "https://cashflow-page.smartdorm-biwboong.shop"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

const authRoute = require("./routes/auth.route");
const typeRoute = require("./routes/type.route");
const categoryRoute = require("./routes/category.route");
const transactionRoute = require("./routes/transaction.route");
const dashboardRoute = require("./routes/dashboard.route");
const userRoute = require("./routes/user.route");

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Expense API is running"
    });
});

app.use("/api/dashboard", dashboardRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/types", typeRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/transactions", transactionRoute);

const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on ${PORT}`);
});