// backend/src/controllers/transaction.controller.js

const transactionService = require("../services/transaction.service");

// =======================
// GET ALL
// =======================
exports.getTransactions = async (req, res) => {
    try {

        const data = await transactionService.getAll();

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }
};

// =======================
// GET ONE
// =======================
exports.getTransaction = async (req, res) => {
    try {

        const data = await transactionService.getById(
            req.params.id
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบข้อมูล"
            });
        }

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }
};

// =======================
// CREATE
// =======================
exports.createTransaction = async (req, res) => {
    try {

        const result = await transactionService.create(
            req.body
        );

        res.status(201).json(result);

    } catch (err) {

        console.error(err);

        res.status(400).json({
            success: false,
            message: err.message,
        });

    }
};

// =======================
// UPDATE
// =======================
exports.updateTransaction = async (req, res) => {
    try {

        const result = await transactionService.update(
            req.params.id,
            req.body
        );

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(400).json({
            success: false,
            message: err.message,
        });

    }
};

// =======================
// DELETE
// =======================
exports.deleteTransaction = async (req, res) => {
    try {

        const result = await transactionService.remove(
            req.params.id
        );

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(400).json({
            success: false,
            message: err.message,
        });

    }
};