const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const sheet = require("../services/sheet.service");

router.use(authMiddleware);

const getAccount = async (userId, accountId) => {
    const rows = await sheet.getRows("Accounts");

    return rows.slice(1).find(row =>
        String(row[0] || "").trim() === String(accountId || "").trim() &&
        String(row[1] || "").trim() === String(userId || "").trim()
    );
};

const updateAccountBalance = async (userId, accountId, change) => {
    const account = await getAccount(userId, accountId);

    if (!account) {
        throw new Error("ไม่พบบัญชีที่เลือก");
    }

    const currentBalance = Number(account[3] || 0);
    const newBalance = currentBalance + change;
    const now = new Date().toISOString();

    await sheet.updateRow("Accounts", account[0], {
        id: account[0],
        userId: account[1],
        name: account[2],
        balance: newBalance,
        createdAt: account[4],
        updateAt: now
    });

    return newBalance;
};

const getType = async (typeId) => {
    const rows = await sheet.getRows("Types");

    return rows.slice(1).find(row =>
        String(row[0] || "").trim() === String(typeId || "").trim()
    );
};

const getCategory = async (categoryId) => {
    const rows = await sheet.getRows("Categories");

    return rows.slice(1).find(row =>
        String(row[0] || "").trim() === String(categoryId || "").trim()
    );
};

const getTransactionBalance = async (excludeId = null) => {
    const rows = await sheet.getRows("Transactions");

    return rows.slice(1)
        .filter(row =>
            !excludeId ||
            String(row[0] || "").trim() !== String(excludeId).trim()
        )
        .reduce((total, row) => {
            return total +
                Number(row[5] || 0) -
                Number(row[6] || 0);
        }, 0);
};

// GET
router.get("/", async (req, res) => {
    try {
        const userId = req.user.id;

        const rows = await sheet.getRows("Transactions");
        const typeRows = await sheet.getRows("Types");
        const categoryRows = await sheet.getRows("Categories");
        const accountRows = await sheet.getRows("Accounts");

        const types = typeRows.slice(1);
        const categories = categoryRows.slice(1);

        const accounts = accountRows.slice(1)
            .filter(row =>
                String(row[1] || "").trim() === String(userId).trim()
            );

        let runningBalance = 0;

        const transactions = rows.slice(1)
            .sort((a, b) => {
                const dateA = new Date(a[1] || 0).getTime();
                const dateB = new Date(b[1] || 0).getTime();

                if (dateA !== dateB) {
                    return dateA - dateB;
                }

                return new Date(a[9] || 0).getTime() -
                    new Date(b[9] || 0).getTime();
            })
            .map(row => {
                const type = types.find(item =>
                    String(item[0]) === String(row[2])
                );

                const category = categories.find(item =>
                    String(item[0]) === String(row[3])
                );

                const account = accounts.find(item =>
                    String(item[0] || "").trim() ===
                    String(row[4] || "").trim()
                );

                const income = Number(row[5] || 0);
                const expense = Number(row[6] || 0);

                runningBalance += income - expense;

                return {
                    id: row[0] || "",
                    date: row[1] || "",
                    typeId: row[2] || "",
                    categoryId: row[3] || "",
                    accountTypesId: row[4] || "",
                    income,
                    expense,
                    balance: runningBalance,
                    note: row[8] || "",
                    createdAt: row[9] || "",
                    updateAt: row[10] || "",
                    typeName: type?.[1] || "",
                    categoryName: category?.[2] || "",
                    accountTypeName: account?.[2] || "",
                    accountName: account?.[2] || ""
                };
            });

        res.json({
            success: true,
            data: transactions
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// CREATE
router.post("/", async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            date,
            typeId,
            categoryId,
            accountTypesId,
            amount,
            note
        } = req.body;

        if (
            !date ||
            !typeId ||
            !categoryId ||
            !accountTypesId ||
            amount === undefined ||
            amount === null ||
            amount === ""
        ) {
            throw new Error("กรุณากรอกข้อมูลให้ครบ");
        }

        const money = Number(amount);

        if (!Number.isFinite(money) || money <= 0) {
            throw new Error("จำนวนเงินไม่ถูกต้อง");
        }

        const type = await getType(typeId);

        if (!type) {
            throw new Error("ไม่พบประเภทที่เลือก");
        }

        const typeName = String(type[1] || "").trim();

        if (typeName !== "รายรับ" && typeName !== "รายจ่าย") {
            throw new Error("ประเภทไม่ถูกต้อง");
        }

        const category = await getCategory(categoryId);

        if (!category) {
            throw new Error("ไม่พบหมวดหมู่ที่เลือก");
        }

        if (String(category[1]) !== String(typeId)) {
            throw new Error("หมวดหมู่นี้ไม่ได้อยู่ในประเภทที่เลือก");
        }

        const account = await getAccount(
            userId,
            accountTypesId
        );

        if (!account) {
            throw new Error("ไม่พบบัญชีที่เลือก");
        }

        let income = 0;
        let expense = 0;
        let accountChange = 0;

        if (typeName === "รายรับ") {
            income = money;
            accountChange = money;
        } else {
            expense = money;
            accountChange = -money;
        }

        const accountBalance =
            await updateAccountBalance(
                userId,
                accountTypesId,
                accountChange
            );

        const previousBalance =
            await getTransactionBalance();

        const transactionBalance =
            previousBalance + income - expense;

        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        await sheet.appendRow("Transactions", [
            id,
            date,
            typeId,
            categoryId,
            accountTypesId,
            income,
            expense,
            transactionBalance,
            note || "",
            now,
            now
        ]);

        res.status(201).json({
            success: true,
            message: "เพิ่มรายการสำเร็จ",
            data: {
                id,
                date,
                typeId,
                categoryId,
                accountTypesId,
                income,
                expense,
                balance: transactionBalance,
                accountBalance,
                note: note || "",
                createdAt: now,
                updateAt: now
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

// UPDATE
router.patch("/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const rows = await sheet.getRows("Transactions");
        const transactions = rows.slice(1);

        const oldRow = transactions.find(row =>
            String(row[0] || "").trim() === String(id).trim()
        );

        if (!oldRow) {
            throw new Error("ไม่พบรายการที่ต้องการแก้ไข");
        }

        const date = req.body.date ?? oldRow[1];
        const typeId = req.body.typeId ?? oldRow[2];
        const categoryId = req.body.categoryId ?? oldRow[3];
        const accountTypesId =
            req.body.accountTypesId ?? oldRow[4];

        const note =
            req.body.note ?? oldRow[8];

        const oldIncome = Number(oldRow[5] || 0);
        const oldExpense = Number(oldRow[6] || 0);

        const oldChange =
            oldIncome > 0
                ? oldIncome
                : -oldExpense;

        const amount =
            req.body.amount !== undefined
                ? Number(req.body.amount)
                : oldIncome > 0
                    ? oldIncome
                    : oldExpense;

        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error("จำนวนเงินไม่ถูกต้อง");
        }

        const type = await getType(typeId);

        if (!type) {
            throw new Error("ไม่พบประเภทที่เลือก");
        }

        const typeName = String(type[1] || "").trim();

        if (typeName !== "รายรับ" && typeName !== "รายจ่าย") {
            throw new Error("ประเภทไม่ถูกต้อง");
        }

        const category = await getCategory(categoryId);

        if (!category) {
            throw new Error("ไม่พบหมวดหมู่ที่เลือก");
        }

        if (String(category[1]) !== String(typeId)) {
            throw new Error("หมวดหมู่นี้ไม่ได้อยู่ในประเภทที่เลือก");
        }

        const oldAccountId =
            String(oldRow[4] || "").trim();

        const newAccountId =
            String(accountTypesId || "").trim();

        const oldAccount =
            await getAccount(
                userId,
                oldAccountId
            );

        if (!oldAccount) {
            throw new Error("ไม่พบบัญชีเดิมของรายการ");
        }

        const newAccount =
            await getAccount(
                userId,
                newAccountId
            );

        if (!newAccount) {
            throw new Error("ไม่พบบัญชีใหม่ที่เลือก");
        }

        let income = 0;
        let expense = 0;
        let newChange = 0;

        if (typeName === "รายรับ") {
            income = amount;
            newChange = amount;
        } else {
            expense = amount;
            newChange = -amount;
        }

        const now = new Date().toISOString();

        const oldAccountBalance =
            Number(oldAccount[3] || 0);

        const restoredBalance =
            oldAccountBalance - oldChange;

        await sheet.updateRow(
            "Accounts",
            oldAccount[0],
            {
                id: oldAccount[0],
                userId: oldAccount[1],
                name: oldAccount[2],
                balance: restoredBalance,
                createdAt: oldAccount[4],
                updateAt: now
            }
        );

        let newAccountBalance;

        try {
            if (oldAccountId === newAccountId) {
                newAccountBalance =
                    restoredBalance + newChange;

                await sheet.updateRow(
                    "Accounts",
                    newAccount[0],
                    {
                        id: newAccount[0],
                        userId: newAccount[1],
                        name: newAccount[2],
                        balance: newAccountBalance,
                        createdAt: newAccount[4],
                        updateAt: now
                    }
                );
            } else {
                newAccountBalance =
                    await updateAccountBalance(
                        userId,
                        newAccountId,
                        newChange
                    );
            }

            const previousBalance =
                await getTransactionBalance(id);

            const transactionBalance =
                previousBalance +
                income -
                expense;

            await sheet.updateRow(
                "Transactions",
                id,
                {
                    id: oldRow[0],
                    date,
                    typeId,
                    categoryId,
                    accountTypesId: newAccountId,
                    income,
                    expense,
                    balance: transactionBalance,
                    note,
                    createdAt: oldRow[9],
                    updateAt: now
                }
            );

            res.json({
                success: true,
                message: "แก้ไขรายการสำเร็จ",
                data: {
                    id,
                    date,
                    typeId,
                    categoryId,
                    accountTypesId: newAccountId,
                    income,
                    expense,
                    balance: transactionBalance,
                    accountBalance: newAccountBalance,
                    note,
                    createdAt: oldRow[9],
                    updateAt: now
                }
            });
        } catch (error) {
            await sheet.updateRow(
                "Accounts",
                oldAccount[0],
                {
                    id: oldAccount[0],
                    userId: oldAccount[1],
                    name: oldAccount[2],
                    balance: oldAccountBalance,
                    createdAt: oldAccount[4],
                    updateAt: now
                }
            );

            throw error;
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const rows =
            await sheet.getRows("Transactions");

        const transaction =
            rows.slice(1).find(row =>
                String(row[0] || "").trim() ===
                String(id || "").trim()
            );

        if (!transaction) {
            throw new Error("ไม่พบรายการที่ต้องการลบ");
        }

        const accountId =
            String(transaction[4] || "").trim();

        const account =
            await getAccount(
                userId,
                accountId
            );

        if (account) {
            const income =
                Number(transaction[5] || 0);

            const expense =
                Number(transaction[6] || 0);

            const change =
                income > 0
                    ? income
                    : -expense;

            const currentBalance =
                Number(account[3] || 0);

            const newBalance =
                currentBalance - change;

            await sheet.updateRow(
                "Accounts",
                account[0],
                {
                    id: account[0],
                    userId: account[1],
                    name: account[2],
                    balance: newBalance,
                    createdAt: account[4],
                    updateAt: new Date().toISOString()
                }
            );
        }

        const deleted =
            await sheet.deleteRow(
                "Transactions",
                id
            );

        if (!deleted) {
            throw new Error("ลบรายการไม่สำเร็จ");
        }

        res.json({
            success: true,
            message: "ลบรายการสำเร็จ"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;