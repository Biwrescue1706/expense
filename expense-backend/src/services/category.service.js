const crypto = require("crypto");
const sheet = require("./sheet.service");

// =====================
// GET ALL
// =====================
exports.getAll = async (typeId) => {

    const rows = (await sheet.getRows("Categories")).slice(1);

    let data = rows.map(row => ({
        id: row[0],
        typeId: row[1],
        name: row[2],
    }));

    if (typeId) {
        data = data.filter(c => c.typeId === typeId);
    }

    return data;
};

// =====================
// CREATE
// =====================
exports.create = async (data) => {

    const { typeId, name } = data;

    if (!typeId || !name) {
        throw new Error("กรุณากรอกข้อมูลให้ครบ");
    }

    // ตรวจสอบว่า type มีจริง
    const types = (await sheet.getRows("Types")).slice(1);

    const existType = types.find(
        t => t[0] === typeId
    );

    if (!existType) {
        throw new Error("ไม่พบประเภท");
    }

    // ตรวจสอบหมวดหมู่ซ้ำ
    const categories = (await sheet.getRows("Categories")).slice(1);

    const duplicate = categories.find(
        c =>
            c[1] === typeId &&
            c[2].trim().toLowerCase() ===
            name.trim().toLowerCase()
    );

    if (duplicate) {
        throw new Error("หมวดหมู่นี้มีอยู่แล้ว");
    }

    await sheet.appendRow("Categories", [
        crypto.randomUUID(),
        typeId,
        name,
    ]);

    return {
        success: true,
        message: "เพิ่มหมวดหมู่สำเร็จ",
    };
};

// =====================
// UPDATE
// =====================
exports.update = async (id, data) => {

    const { typeId, name } = data;

    const rows = await sheet.getRows("Categories");

    const headers = rows[0];
    const list = rows.slice(1);

    const index = list.findIndex(
        r => r[0] === id
    );

    if (index === -1) {
        throw new Error("ไม่พบข้อมูล");
    }

    const duplicate = list.find(
        r =>
            r[0] !== id &&
            r[1] === typeId &&
            r[2].trim().toLowerCase() ===
            name.trim().toLowerCase()
    );

    if (duplicate) {
        throw new Error("หมวดหมู่นี้มีอยู่แล้ว");
    }

    const newRow = headers.map(h => {

        switch (h) {
            case "id":
                return id;
            case "typeId":
                return typeId;
            case "name":
                return name;
            default:
                return "";
        }

    });

    rows[index + 1] = newRow;

    await sheet.updateRow("Categories", id, {
        id,
        typeId,
        name,
    });

    return {
        success: true,
        message: "แก้ไขสำเร็จ",
    };
};

// =====================
// DELETE
// =====================
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
        message: "ลบสำเร็จ",
    };
};