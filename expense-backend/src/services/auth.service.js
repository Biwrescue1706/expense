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

    const { email, password } = data;

    const users = await sheet.getRows("Users");
    const rows = users.slice(1);

    const user = rows.find(
        row => row[2] && row[2].toLowerCase() === email.toLowerCase()
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
            username: user[1],
            email: user[2],
            role: user[4],
            fullName: user[8]
        },
        JWT_SECRET,
        {
            expiresIn: "10m"
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
            fullName: user[8],
            phone: user[9]
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