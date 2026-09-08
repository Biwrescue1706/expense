const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const sheet = require("../services/sheet.service");

router.use(authMiddleware);

const getAccountType = async (userId, id) => {
    const rows = await sheet.getRows("AccountTypes");

    return rows.slice(1).find(row =>
        String(row[0] || "").trim() === String(id || "").trim() &&
        String(row[1] || "").trim() === String(userId || "").trim()
    );
};

// GET /api/account-types
router.get("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const rows = await sheet.getRows("AccountTypes");

        const data = rows.slice(1)
            .filter(row =>
                row[0] &&
                String(row[1] || "").trim() === String(userId).trim()
            )
            .map(row => ({
                id: row[0] || "",
                userId: row[1] || "",
                name: row[2] || "",
                createdAt: row[3] || "",
                updateAt: row[4] || ""
            }));

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
});

// GET /api/account-types/:id
router.get("/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const row = await getAccountType(userId, req.params.id);

        if (!row) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบประเภทบัญชี"
            });
        }

        res.json({
            success: true,
            data: {
                id: row[0],
                userId: row[1],
                name: row[2] || "",
                createdAt: row[3] || "",
                updateAt: row[4] || ""
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// POST /api/account-types
router.post("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const name = String(req.body.name || "").trim();

        if (!name) {
            throw new Error("กรุณากรอกชื่อประเภทบัญชี");
        }

        const rows = await sheet.getRows("AccountTypes");

        const exists = rows.slice(1).some(row =>
            String(row[1] || "").trim() === String(userId).trim() &&
            String(row[2] || "").trim().toLowerCase() ===
            name.toLowerCase()
        );

        if (exists) {
            throw new Error("มีประเภทบัญชีนี้อยู่แล้ว");
        }

        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        await sheet.appendRow("AccountTypes", [
            id,
            userId,
            name,
            now,
            now
        ]);

        res.status(201).json({
            success: true,
            message: "เพิ่มประเภทบัญชีสำเร็จ",
            data: {
                id,
                userId,
                name,
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

// PATCH /api/account-types/:id
router.patch("/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const oldRow = await getAccountType(userId, id);

        if (!oldRow) {
            throw new Error("ไม่พบประเภทบัญชี");
        }

        const name =
            req.body.name !== undefined
                ? String(req.body.name).trim()
                : String(oldRow[2] || "").trim();

        if (!name) {
            throw new Error("กรุณากรอกชื่อประเภทบัญชี");
        }

        const rows = await sheet.getRows("AccountTypes");

        const exists = rows.slice(1).some(row =>
            String(row[0] || "").trim() !== String(id).trim() &&
            String(row[1] || "").trim() === String(userId).trim() &&
            String(row[2] || "").trim().toLowerCase() ===
            name.toLowerCase()
        );

        if (exists) {
            throw new Error("มีประเภทบัญชีนี้อยู่แล้ว");
        }

        const now = new Date().toISOString();

        await sheet.updateRow("AccountTypes", id, {
            id: oldRow[0],
            userId: oldRow[1],
            name,
            createdAt: oldRow[3] || "",
            updateAt: now
        });

        res.json({
            success: true,
            message: "แก้ไขประเภทบัญชีสำเร็จ",
            data: {
                id: oldRow[0],
                userId: oldRow[1],
                name,
                createdAt: oldRow[3] || "",
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

// DELETE /api/account-types/:id
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const accountType = await getAccountType(userId, id);

        if (!accountType) {
            throw new Error("ไม่พบประเภทบัญชี");
        }

        const transactions =
            await sheet.getRows("Transactions");

        const used = transactions.slice(1).some(row =>
            String(row[3] || "").trim() === String(id).trim()
        );

        if (used) {
            throw new Error(
                "ไม่สามารถลบประเภทบัญชีที่มีรายการธุรกรรมใช้งานอยู่ได้"
            );
        }

        const deleted =
            await sheet.deleteRow("AccountTypes", id);

        if (!deleted) {
            throw new Error("ลบประเภทบัญชีไม่สำเร็จ");
        }

        res.json({
            success: true,
            message: "ลบประเภทบัญชีสำเร็จ"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;