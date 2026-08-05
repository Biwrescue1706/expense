//src/services/auth.service.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sheet = require("./sheet.service");

const JWT_SECRET = process.env.JWT_SECRET || "phuwanat_super_secret_key";

// Register
exports.register = async (data) => {

    const { name, email, password } = data;

    const users = await sheet.getRows("Users");
    const rows = users.slice(1);

    const duplicate = rows.find(
        row =>
            row[2] &&
            row[2].toLowerCase() === email.toLowerCase()
    );

    if (duplicate) {
        throw new Error("Email นี้ถูกใช้งานแล้ว");
    }

    const hash = await bcrypt.hash(password, 10);

    await sheet.appendRow("Users", [
        crypto.randomUUID(),
        name,
        email,
        hash,
        "user",
        new Date().toISOString()
    ]);

    return {
        success: true,
        message: "สมัครสมาชิกสำเร็จ"
    };

};

// Login
exports.login = async (data) => {

    const { email, password } = data;

    const users = await sheet.getRows("Users");
    const rows = users.slice(1);

    const user = rows.find(
        row =>
            row[2] &&
            row[2].toLowerCase() === email.toLowerCase()
    );

    if (!user) {
        throw new Error("Email หรือ Password ไม่ถูกต้อง");
    }

    const ok = await bcrypt.compare(password, user[3]);

    if (!ok) {
        throw new Error("Email หรือ Password ไม่ถูกต้อง");
    }

    const token = jwt.sign(
        {
            id: user[0],
            name: user[1],
            email: user[2],
            role: user[4]
        },
        JWT_SECRET,
        {
            expiresIn: "10m"
        }
    );

    return {
        success: true,
        message: "เข้าสู่ระบบสำเร็จ"
    };

};

// Logout
exports.logout = (req, res) => {

    res.clearCookie("token");

    return res.json({
        success: true,
        message: "ออกจากระบบสำเร็จ"
    });

};