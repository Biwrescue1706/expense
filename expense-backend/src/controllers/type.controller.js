//src/controllers/type.controller.js

const sheetService = require("../services/sheet.service");

exports.getTypes = async (req, res) => {
    try {
        const rows = await sheetService.getRows("Type");

        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};

// CREATE
exports.createType = async (req, res) => {

    try {

        const { typeName } = req.body;

        if (!typeName) {

            return res.status(400).json({

                success: false,

                message: "typeName is required",

            });

        }

        const duplicate = await sheet.findOne(

            "Type",

            "typeName",

            typeName

        );

        if (duplicate) {

            return res.status(409).json({

                success: false,

                message: "Type already exists",

            });

        }

        const id = await sheet.nextId("Type");

        await sheet.appendRow(

            "Type",

            [

                id,

                typeName,

            ]

        );

        res.status(201).json({

            success: true,

            message: "Create success",

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

// UPDATE
exports.updateType = async (req, res) => {

    try {

        const { id } = req.params;

        const { typeName } = req.body;

        const ok = await sheet.updateRow(

            "Type",

            id,

            {

                id,

                typeName,

            }

        );

        if (!ok) {

            return res.status(404).json({

                success: false,

                message: "Type not found",

            });

        }

        res.json({

            success: true,

            message: "Update success",

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

// DELETE
exports.deleteType = async (req, res) => {

    try {

        const { id } = req.params;

        await sheet.deleteRow(

            "Type",

            id

        );

        res.json({

            success: true,

            message: "Delete success",

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};