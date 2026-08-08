// backend/src/services/type.service.js

const crypto = require("crypto");
const sheet = require("./sheet.service");

// =======================
// ดึงทั้งหมด
// =======================
exports.getAll = async () => {

    const rows = await sheet.getRows("Types");

    return rows.slice(1).map(row => ({
        id: row[0],
        name: row[1],
        createdAt: row[2],
        updatedAt: row[3],
    }));
};


// =======================
// เพิ่ม
// =======================
exports.create = async (data) => {

    const { name } = data;

    if (!name) {
        throw new Error("กรุณากรอกชื่อประเภท");
    }

    const rows = (await sheet.getRows("Types")).slice(1);

    const duplicate = rows.find(
        row =>
            row[1] &&
            row[1].trim().toLowerCase() ===
            name.trim().toLowerCase()
    );

    if (duplicate) {
        throw new Error("ประเภทนี้มีอยู่แล้ว");
    }

    // เวลาปัจจุบัน
    const now = new Date().toISOString();

    await sheet.appendRow("Types", [
        crypto.randomUUID(),
        name.trim(),
        now,
        "",
    ]);

    return {
        success: true,
        message: "เพิ่มประเภทสำเร็จ"
    };
};


// =======================
// แก้ไข
// =======================
exports.update = async (id, data) => {

    const { name } = data;

    if (!name) {
        throw new Error("กรุณากรอกชื่อประเภท");
    }

    const rows = await sheet.getRows("Types");

    const list = rows.slice(1);

    const index = list.findIndex(
        row => row[0] === id
    );

    if (index === -1) {
        throw new Error("ไม่พบข้อมูล");
    }

    // ข้อมูลเดิม
    const oldRow = list[index];

    // ตรวจสอบชื่อซ้ำ
    const duplicate = list.find(
        row =>
            row[0] !== id &&
            row[1] &&
            row[1].trim().toLowerCase() ===
            name.trim().toLowerCase()
    );

    if (duplicate) {
        throw new Error("ประเภทนี้มีอยู่แล้ว");
    }

    // createdAt เดิม
    const createdAt = oldRow[2];

    // updatedAt ใหม่
    const updatedAt = new Date().toISOString();

    await sheet.updateRow(
        "Types",
        id,
        {
            id,
            name: name.trim(),
            createdAt,
            updatedAt,
        }
    );

    return {
        success: true,
        message: "แก้ไขสำเร็จ"
    };
};


// =======================
// ลบ
// =======================
exports.remove = async (id) => {

    const ok = await sheet.deleteRow(
        "Types",
        id
    );

    if (!ok) {
        throw new Error("ไม่พบข้อมูล");
    }

    return {
        success: true,
        message: "ลบสำเร็จ"
    };
};