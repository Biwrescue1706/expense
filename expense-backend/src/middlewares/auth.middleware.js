const jwt = require("jsonwebtoken");

const JWT_SECRET =
    process.env.JWT_SECRET || "expense-secret";

module.exports = (req, res, next) => {

    let token = null;

    if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token && req.headers.authorization) {

        const authHeader = req.headers.authorization;

        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

    }

    if (!token) {

        return res.status(401).json({
            success: false,
            message: "กรุณาเข้าสู่ระบบ"
        });

    }

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Token หมดอายุ หรือไม่ถูกต้อง"
        });

    }

};