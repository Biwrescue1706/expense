const accountTypeService = require("../services/accountType.service");

// GET
exports.getAccountTypes = async (req, res) => {
    try {
        const data = await accountTypeService.getAll();

        res.json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// CREATE
exports.createAccountType = async (req, res) => {
    try {
        const result = await accountTypeService.create(req.body);

        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// UPDATE
exports.updateAccountType = async (req, res) => {
    try {
        const result = await accountTypeService.update(
            req.params.id,
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

// DELETE
exports.deleteAccountType = async (req, res) => {
    try {
        const result = await accountTypeService.remove(req.params.id);

        res.json(result);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};