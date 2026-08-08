// backend/src/controllers/dashboard.controller.js

const dashboardService = require("../services/dashboard.service");

exports.getDashboard = async (req, res) => {
    try {

        const data = await dashboardService.getDashboard();

        res.json({
            success: true,
            data,
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }
};