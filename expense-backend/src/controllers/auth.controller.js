const authService = require("../services/auth.service");

// Register
exports.register = async (req, res) => {
    try {

        const result = await authService.register(req.body);

        res.status(201).json(result);

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }
};

// Login
exports.login = async (req, res) => {
    try {

        const result = await authService.login(req.body);

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: true,      // เปลี่ยนเป็น true เมื่อใช้ HTTPS
            sameSite: "lax",
            maxAge: 30 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "เข้าสู่ระบบสำเร็จ",
            user: result.user
        });

    } catch (err) {

        console.error("===== LOGIN ERROR =====");
        console.error(err);
        console.error(err.stack);

        return res.status(401).json({
            success: false,
            message: err.message
        });

    }
}

// Forgot Password
exports.forgotPassword = async (req, res) => {

    try {

        const result = await authService.forgotPassword(req.body.email);

        res.json(result);

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

// Verify OTP
exports.verifyOtp = async (req, res) => {

    try {

        const {

            email,

            otp

        } = req.body;

        const result = await authService.verifyOtp(

            email,

            otp

        );

        res.json(result);

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

// Reset Password
exports.resetPassword = async (req, res) => {

    try {

        const {

            email,

            password

        } = req.body;

        const result = await authService.resetPassword(

            email,

            password

        );

        res.json(result);

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

// Profile
exports.profile = async (req, res) => {

    res.json({

        success: true,

        user: req.user

    });

};

// Change Password
exports.changePassword = async (req, res) => {

    try {

        const result = await authService.changePassword(

            req.user,

            req.body

        );

        res.json(result);

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

// Logout
exports.logout = (req, res) => {

    res.clearCookie("token");

    return res.json({
        success: true,
        message: "ออกจากระบบสำเร็จ"
    });

};