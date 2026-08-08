// backend/src/controllers/dashboard.controller.js

const dashboardService = require("../services/dashboard.service");

exports.getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        const data = await dashboardService.getDashboard(userId);

        res.json({
            success: true,
            data
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};