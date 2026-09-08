const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const sheet = require("../services/sheet.service");

// GET
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const rows = await sheet.getRows("AccountTypes");

        const data = rows
            .slice(1)
            .filter(row => String(row[1]) === String(userId))
            .map(row => ({
                id: row[0],
                userId: row[1],
                name: row[2] || "",
                createdAt: row[3] || "",
                updatedAt: row[4] || ""
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

// CREATE
router.post("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        if (!name || !String(name).trim()) {
            throw new Error("กรุณากรอกชื่อประเภทบัญชี");
        }

        const accountTypeName = String(name).trim();
        const rows = await sheet.getRows("AccountTypes");

        const duplicate = rows.slice(1).find(row =>
            String(row[1] || "") === String(userId) &&
            String(row[2] || "").trim().toLowerCase() ===
            accountTypeName.toLowerCase()
        );

        if (duplicate) {
            throw new Error("มีประเภทบัญชีนี้อยู่แล้ว");
        }

        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        await sheet.appendRow("AccountTypes", [
            id,
            userId,
            accountTypeName,
            now,
            now
        ]);

        res.status(201).json({
            success: true,
            message: "เพิ่มประเภทบัญชีสำเร็จ",
            data: {
                id,
                userId,
                name: accountTypeName,
                createdAt: now,
                updatedAt: now
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
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const rows = await sheet.getRows("AccountTypes");

        const accountTypes = rows.slice(1);

        const index = accountTypes.findIndex(row =>
            String(row[0]) === String(id) &&
            String(row[1]) === String(userId)
        );

        if (index === -1) {
            throw new Error("ไม่พบประเภทบัญชี");
        }

        const oldRow = accountTypes[index];

        const name = req.body.name !== undefined
            ? String(req.body.name).trim()
            : String(oldRow[2] || "").trim();

        if (!name) {
            throw new Error("กรุณากรอกชื่อประเภทบัญชี");
        }

        const duplicate = accountTypes.find(row =>
            String(row[0]) !== String(id) &&
            String(row[1]) === String(userId) &&
            String(row[2] || "").trim().toLowerCase() ===
            name.toLowerCase()
        );

        if (duplicate) {
            throw new Error("มีประเภทบัญชีนี้อยู่แล้ว");
        }

        const updatedAt = new Date().toISOString();

        await sheet.updateRow("AccountTypes", id, {
            id: oldRow[0],
            userId: oldRow[1],
            name,
            createdAt: oldRow[3] || "",
            updatedAt
        });

        res.json({
            success: true,
            message: "แก้ไขประเภทบัญชีสำเร็จ",
            data: {
                id: oldRow[0],
                userId: oldRow[1],
                name,
                createdAt: oldRow[3] || "",
                updatedAt
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const rows = await sheet.getRows("AccountTypes");

        const accountType = rows.slice(1).find(row =>
            String(row[0]).trim() === String(id).trim() &&
            String(row[1]).trim() === String(userId).trim()
        );

        if (!accountType) {
            throw new Error("ไม่พบประเภทบัญชี");
        }

        const ok = await sheet.deleteRow("AccountTypes", id);

        if (!ok) {
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