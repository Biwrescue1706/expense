const crypto = require("crypto");
const sheet = require("./sheet.service");

// GET ALL
exports.getAll = async () => {
    const rows = await sheet.getRows("AccountTypes");

    return rows
        .slice(1)
        .map(row => ({
            id: row[0],
            name: row[1] || "",
            createdAt: row[2] || "",
            updatedAt: row[3] || ""
        }));
};

// CREATE
exports.create = async (data) => {
    const { name } = data;

    if (!name || !String(name).trim()) {
        throw new Error("กรุณากรอกชื่อประเภทบัญชี");
    }

    const accountTypeName = String(name).trim();

    const rows = await sheet.getRows("AccountTypes");
    const accountTypes = rows.slice(1);

    const duplicate = accountTypes.find(row =>
        String(row[1] || "").trim().toLowerCase() ===
        accountTypeName.toLowerCase()
    );

    if (duplicate) {
        throw new Error("มีประเภทบัญชีนี้อยู่แล้ว");
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await sheet.appendRow("AccountTypes", [
        id,
        accountTypeName,
        now
    ]);

    return {
        success: true,
        message: "เพิ่มประเภทบัญชีสำเร็จ",
        data: {
            id,
            name: accountTypeName,
            createdAt: now,
            updatedAt: now
        }
    };
};

// UPDATE
exports.update = async (id, data) => {
    const rows = await sheet.getRows("AccountTypes");
    const accountTypes = rows.slice(1);

    const index = accountTypes.findIndex(row =>
        String(row[0]) === String(id)
    );

    if (index === -1) {
        throw new Error("ไม่พบประเภทบัญชี");
    }

    const oldRow = accountTypes[index];

    const name = data.name !== undefined
        ? String(data.name).trim()
        : oldRow[1];

    if (!name) {
        throw new Error("กรุณากรอกชื่อประเภทบัญชี");
    }

    const duplicate = accountTypes.find(row =>
        String(row[0]) !== String(id) &&
        String(row[1] || "").trim().toLowerCase() ===
        name.toLowerCase()
    );

    if (duplicate) {
        throw new Error("มีประเภทบัญชีนี้อยู่แล้ว");
    }

    const updatedAt = new Date().toISOString();

    await sheet.updateRow("AccountTypes", id, {
        id: oldRow[0],
        name,
        createdAt: oldRow[2],
        updatedAt
    });

    return {
        success: true,
        message: "แก้ไขประเภทบัญชีสำเร็จ"
    };
};

// DELETE
exports.remove = async (id) => {
    const rows = await sheet.getRows("AccountTypes");

    if (!rows || rows.length <= 1) {
        throw new Error("ไม่พบข้อมูลประเภทบัญชี");
    }

    const accountType = rows.slice(1).find(row =>
        String(row[0] || "").trim() === String(id || "").trim()
    );

    if (!accountType) {
        throw new Error("ไม่พบประเภทบัญชี");
    }

    const ok = await sheet.deleteRow("AccountTypes", id);

    if (!ok) {
        throw new Error("ลบประเภทบัญชีไม่สำเร็จ");
    }

    return {
        success: true,
        message: "ลบประเภทบัญชีสำเร็จ"
    };
};