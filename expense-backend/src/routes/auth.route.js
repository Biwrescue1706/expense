const router = require("express").Router();

const controller = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// =======================
// Public
// =======================

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/logout", controller.logout);

router.post("/forgot-password", controller.forgotPassword);

router.post("/verify-otp", controller.verifyOtp);

router.post("/reset-password", controller.resetPassword);

// =======================
// Private
// =======================

router.get(

    "/profile",

    authMiddleware,

    controller.profile

);

router.post(

    "/change-password",

    authMiddleware,

    controller.changePassword

);

module.exports = router;