const sheet = require("../services/sheet.service");


// GET ALL
exports.getTransactions = async (req, res) => {
    try {

        const transactions = await sheet.getRows("Transactions");
        const categories = await sheet.getRows("Categories");
        const types = await sheet.getRows("Type");

        let balance = 0;

        const data = transactions.map((item) => {

            const category = categories.find(
                c => c.id == item.categoryId
            );

            const type = types.find(
                t => t.id == category?.typeId
            );

            const amount = Number(item.amount);

            let income = 0;
            let expense = 0;

            if (type?.typeName === "รายรับ") {
                income = amount;
                balance += amount;
            } else {
                expense = amount;
                balance -= amount;
            }

            return {
                id: item.id,
                date: item.date,
                category: category?.name,
                typeName: type?.typeName,
                income,
                expense,
                balance,
                note: item.note
            };

        });

        res.json(data);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// GET ONE
exports.getTransaction = async (req, res) => {

    try {

        const transaction = await sheet.findById(
            "Transactions",
            req.params.id
        );

        if (!transaction) {

            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });

        }

        res.json(transaction);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

// CREATE
exports.createTransaction = async (req, res) => {

    try {

        const {
            date,
            categoryId,
            amount,
            note,
        } = req.body;

        if (!date || !categoryId || !amount) {

            return res.status(400).json({
                success: false,
                message: "กรุณากรอกข้อมูลให้ครบ",
            });

        }

        const id = await sheet.nextId("Transactions");

        await sheet.appendRow("Transactions", [
            id,
            date,
            categoryId,
            amount,
            note || "",
        ]);

        res.status(201).json({
            success: true,
            message: "เพิ่มข้อมูลสำเร็จ",
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

// UPDATE
exports.updateTransaction = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            date,
            categoryId,
            amount,
            note,
        } = req.body;

        const ok = await sheet.updateRow(
            "Transactions",
            id,
            {
                id,
                date,
                categoryId,
                amount,
                note,
            }
        );

        if (!ok) {

            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });

        }

        res.json({
            success: true,
            message: "อัปเดตสำเร็จ",
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

// DELETE
exports.deleteTransaction = async (req, res) => {

    try {

        await sheet.deleteRow(
            "Transactions",
            req.params.id
        );

        res.json({
            success: true,
            message: "ลบข้อมูลสำเร็จ",
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};