const sheet = require("../services/sheet.service");

// ======================
// GET ALL
// ======================

exports.getCategories = async (req, res) => {
    try {

        let rows = await sheet.getRows("Categories");

        const { typeId } = req.query;

        if (typeId) {
            rows = rows.filter(r => r.typeId == typeId);
        }

        res.json(rows);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// ======================
// GET ONE
// ======================

exports.getCategory = async (req, res) => {

    try {

        const category = await sheet.findById(
            "Categories",
            req.params.id
        );

        if (!category) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });

        }

        res.json(category);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================
// CREATE
// ======================

exports.createCategory = async (req, res) => {

    try {

        const { typeId, name } = req.body;

        if (!typeId || !name) {

            return res.status(400).json({
                success: false,
                message: "typeId and name are required"
            });

        }

        const rows = await sheet.getRows("Categories");

        const duplicate = rows.find(r =>
            r.typeId == typeId &&
            r.name.trim().toLowerCase() == name.trim().toLowerCase()
        );

        if (duplicate) {

            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });

        }

        const id = await sheet.nextId("Categories");

        await sheet.appendRow("Categories", [

            id,

            typeId,

            name

        ]);

        res.status(201).json({

            success: true,

            message: "Create success"

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ======================
// UPDATE
// ======================

exports.updateCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const { typeId, name } = req.body;

        const rows = await sheet.getRows("Categories");

        const duplicate = rows.find(r =>
            r.id != id &&
            r.typeId == typeId &&
            r.name.trim().toLowerCase() == name.trim().toLowerCase()
        );

        if (duplicate) {

            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });

        }

        const ok = await sheet.updateRow(
            "Categories",
            id,
            {
                id,
                typeId,
                name
            }
        );

        if (!ok) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });

        }

        res.json({
            success: true,
            message: "Update success"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================
// DELETE
// ======================

exports.deleteCategory = async (req, res) => {

    try {

        await sheet.deleteRow(
            "Categories",
            req.params.id
        );

        res.json({

            success: true,

            message: "Delete success"

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};