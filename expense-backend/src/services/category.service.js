const crypto = require("crypto");
const sheet = require("./sheet.service");

// =======================
// GET ALL
// =======================
exports.getAll = async (type) => {

    let rows = await sheet.getRows("Categories");

    rows = rows.slice(1).map(row => ({
        id: row[0],
        type: row[1],
        name: row[2],
    }));

    if (type) {
        rows = rows.filter(
            item => item.type === type
        );
    }

    return rows;

};

// =======================
// GET ONE
// =======================
exports.getById = async (id) => {

    const rows = await sheet.getRows("Categories");

    const list = rows.slice(1).map(row => ({
        id: row[0],
        type: row[1],
        name: row[2],
    }));

    return list.find(item => item.id === id);

};

// =======================
// CREATE
// =======================
exports.create = async (data) => {

    const { type, name } = data;

    if (!type || !name) {
        throw new Error("กรุณากรอกข้อมูลให้ครบ");
    }

    const rows = (await sheet.getRows("Categories")).slice(1);

    const duplicate = rows.find(
        row =>
            row[1] &&
            row[2] &&
            row[1].trim().toLowerCase() === type.trim().toLowerCase() &&
            row[2].trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
        throw new Error("หมวดหมู่นี้มีอยู่แล้ว");
    }

    await sheet.appendRow("Categories", [
        crypto.randomUUID(),
        type,
        name
    ]);

    return {
        success: true,
        message: "เพิ่มหมวดหมู่สำเร็จ"
    };

};

// =======================
// UPDATE
// =======================
exports.update = async (id, data) => {

    const { type, name } = data;

    const rows = (await sheet.getRows("Categories")).slice(1);

    const duplicate = rows.find(
        row =>
            row[0] !== id &&
            row[1].trim().toLowerCase() === type.trim().toLowerCase() &&
            row[2].trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
        throw new Error("หมวดหมู่นี้มีอยู่แล้ว");
    }

    const ok = await sheet.updateRow(
        "Categories",
        id,
        {
            id,
            type,
            name,
        }
    );

    if (!ok) {
        throw new Error("ไม่พบข้อมูล");
    }

    return {
        success: true,
        message: "แก้ไขสำเร็จ"
    };

};

// =======================
// DELETE
// =======================
exports.remove = async (id) => {

    const ok = await sheet.deleteRow(
        "Categories",
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