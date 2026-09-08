const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const sheet = require("../services/sheet.service");

router.use(authMiddleware);

const getAccount = async (userId, id) => {
    const rows = await sheet.getRows("Accounts");

    return rows.slice(1).find(row =>
        String(row[0] || "").trim() === String(id || "").trim() &&
        String(row[1] || "").trim() === String(userId || "").trim()
    );
};

// GET /api/accounts
router.get("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const rows = await sheet.getRows("Accounts");

        const accounts = rows.slice(1)
            .filter(row =>
                row[0] &&
                String(row[1] || "").trim() === String(userId).trim()
            )
            .map(row => ({
                id: row[0] || "",
                userId: row[1] || "",
                name: row[2] || "",
                balance: Number(row[3] || 0),
                createdAt: row[4] || "",
                updateAt: row[5] || ""
            }));

        res.json({
            success: true,
            data: accounts
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// GET /api/accounts/:id
router.get("/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const account = await getAccount(userId, req.params.id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบบัญชี"
            });
        }

        res.json({
            success: true,
            data: {
                id: account[0] || "",
                userId: account[1] || "",
                name: account[2] || "",
                balance: Number(account[3] || 0),
                createdAt: account[4] || "",
                updateAt: account[5] || ""
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// POST /api/accounts
router.post("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const name = String(req.body.name || "").trim();

        if (!name) {
            throw new Error("กรุณากรอกชื่อบัญชี");
        }

        const rows = await sheet.getRows("Accounts");

        const exists = rows.slice(1).some(row =>
            String(row[1] || "").trim() === String(userId).trim() &&
            String(row[2] || "").trim().toLowerCase() ===
            name.toLowerCase()
        );

        if (exists) {
            throw new Error("มีบัญชีนี้อยู่แล้ว");
        }

        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        await sheet.appendRow("Accounts", [
            id,
            userId,
            name,
            0,
            now,
            now
        ]);

        res.status(201).json({
            success: true,
            message: "เพิ่มบัญชีสำเร็จ",
            data: {
                id,
                userId,
                name,
                balance: 0,
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

// PATCH /api/accounts/:id
router.patch("/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const oldAccount = await getAccount(userId, id);

        if (!oldAccount) {
            throw new Error("ไม่พบบัญชี");
        }

        const name =
            req.body.name !== undefined
                ? String(req.body.name).trim()
                : String(oldAccount[2] || "").trim();

        if (!name) {
            throw new Error("กรุณากรอกชื่อบัญชี");
        }

        const rows = await sheet.getRows("Accounts");

        const exists = rows.slice(1).some(row =>
            String(row[0] || "").trim() !== String(id).trim() &&
            String(row[1] || "").trim() === String(userId).trim() &&
            String(row[2] || "").trim().toLowerCase() ===
            name.toLowerCase()
        );

        if (exists) {
            throw new Error("มีบัญชีนี้อยู่แล้ว");
        }

        const now = new Date().toISOString();

        await sheet.updateRow("Accounts", id, {
            id: oldAccount[0],
            userId: oldAccount[1],
            name,
            balance: Number(oldAccount[3] || 0),
            createdAt: oldAccount[4] || "",
            updateAt: now
        });

        res.json({
            success: true,
            message: "แก้ไขบัญชีสำเร็จ",
            data: {
                id: oldAccount[0],
                userId: oldAccount[1],
                name,
                balance: Number(oldAccount[3] || 0),
                createdAt: oldAccount[4] || "",
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

// DELETE /api/accounts/:id
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const account = await getAccount(userId, id);

        if (!account) {
            throw new Error("ไม่พบบัญชี");
        }

        const balance = Number(account[3] || 0);

        if (balance !== 0) {
            throw new Error(
                "ไม่สามารถลบบัญชีที่มียอดคงเหลือได้"
            );
        }

        const transactions =
            await sheet.getRows("Transactions");

        const hasTransaction =
            transactions.slice(1).some(row =>
                String(row[3] || "").trim() ===
                String(id).trim()
            );

        if (hasTransaction) {
            throw new Error(
                "ไม่สามารถลบบัญชีที่มีรายการธุรกรรมได้"
            );
        }

        const deleted =
            await sheet.deleteRow("Accounts", id);

        if (!deleted) {
            throw new Error("ลบบัญชีไม่สำเร็จ");
        }

        res.json({
            success: true,
            message: "ลบบัญชีสำเร็จ"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;