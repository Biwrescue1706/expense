//src/services/auth.service.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sheet = require("./sheet.service");

const JWT_SECRET = process.env.JWT_SECRET || "phuwanat_super_secret_key";

// Register
exports.register = async (data) => {

    const {
        username,
        email,
        password,
        prefix,
        firstName,
        lastName,
        phone,
        citizenId
    } = data;

    if (!username) throw new Error("กรุณากรอก Username");

    if (!/^\d{10}$/.test(phone)) {
        throw new Error("เบอร์โทรต้องมี 10 หลัก");
    }

    if (!/^\d{13}$/.test(citizenId)) {
        throw new Error("เลขบัตรประชาชนต้องมี 13 หลัก");
    }

    const users = await sheet.getRows("Users");
    const rows = users.slice(1);

    if (rows.find(row => row[1] === username)) {
        throw new Error("Username นี้ถูกใช้งานแล้ว");
    }

    if (rows.find(row => row[2]?.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email นี้ถูกใช้งานแล้ว");
    }

    if (rows.find(row => row[9] === phone)) {
        throw new Error("เบอร์โทรนี้ถูกใช้งานแล้ว");
    }

    if (rows.find(row => row[10] === citizenId)) {
        throw new Error("เลขบัตรประชาชนนี้ถูกใช้งานแล้ว");
    }

    const hash = await bcrypt.hash(password, 10);

    const fullName = `${prefix}${firstName} ${lastName}`;

    await sheet.appendRow("Users", [
        crypto.randomUUID(),
        username,
        email,
        hash,
        "user",
        prefix,
        firstName,
        lastName,
        fullName,
        phone,
        citizenId,
        new Date().toISOString()
    ]);

    return {
        success: true,
        message: "สมัครสมาชิกสำเร็จ"
    };

};

//Login
exports.login = async (data) => {

    const { username, password } = data;

    if (!username || !password) {
        throw new Error("กรุณากรอก Username / Email และ Password");
    }

    const rows = (await sheet.getRows("Users")).slice(1);

    const user = rows.find(row => {

        const userName = row[1]?.trim().toLowerCase();
        const email = row[2]?.trim().toLowerCase();

        return (
            userName === username.trim().toLowerCase() ||
            email === username.trim().toLowerCase()
        );

    });

    if (!user) {
        throw new Error("Username / Email หรือ Password ไม่ถูกต้อง");
    }

    const ok = await bcrypt.compare(
        password,
        user[3]
    );

    if (!ok) {
        throw new Error("Username / Email หรือ Password ไม่ถูกต้อง");
    }

    const token = jwt.sign(
        {
            id: user[0],
            username: user[1],
            email: user[2],
            role: user[4],
            prefix: user[5],
            firstName: user[6],
            lastName: user[7],
            fullName: user[8],
            phone: user[9],
            citizenId: user[10]
        },
        JWT_SECRET,
        {
            expiresIn: "30m"
        }
    );

    return {
        success: true,
        token,
        user: {
            id: user[0],
            username: user[1],
            email: user[2],
            role: user[4],
            prefix: user[5],
            firstName: user[6],
            lastName: user[7],
            fullName: user[8],
            phone: user[9],
            citizenId: user[10]
        }
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