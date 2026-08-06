const crypto = require("crypto");
const sheet = require("./sheet.service");

// =======================
// ดึงรายการทั้งหมด
// =======================
exports.getAll = async () => {

    const rows = await sheet.getRows("Transactions");

    return rows.slice(1).map(row => ({
        id: row[0],
        date: row[1],
        type: row[2],
        category: row[3],
        description: row[4],
        income: Number(row[5] || 0),
        expense: Number(row[6] || 0),
        balance: Number(row[7] || 0),
        note: row[8] || ""
    }));

};

// =======================
// เพิ่มรายการ
// =======================
exports.create = async (data) => {

    const {
        date,
        type,
        category,
        description,
        amount,
        note
    } = data;

    if (!type || !category || !amount) {
        throw new Error("กรุณากรอกข้อมูลให้ครบ");
    }

    // =======================
    // ตรวจสอบ Type
    // =======================

    const typeRows = (await sheet.getRows("Types")).slice(1);

    const existType = typeRows.find(
        t =>
            t[1] &&
            t[1].trim().toLowerCase() ===
            type.trim().toLowerCase()
    );

    if (!existType) {
        await sheet.appendRow("Types", [
            crypto.randomUUID(),
            type
        ]);
    }

    // =======================
    // ตรวจสอบ Category
    // =======================

    const categoryRows = (await sheet.getRows("Categories")).slice(1);

    const existCategory = categoryRows.find(
        c =>
            c[1] &&
            c[1].trim().toLowerCase() ===
            category.trim().toLowerCase()
    );

    if (!existCategory) {
        await sheet.appendRow("Categories", [
            crypto.randomUUID(),
            category,
            type
        ]);
    }

    // =======================
    // คำนวณยอดคงเหลือ
    // =======================

    const transactionRows = (await sheet.getRows("Transactions")).slice(1);

    let lastBalance = 0;

    if (transactionRows.length > 0) {
        lastBalance = Number(
            transactionRows[transactionRows.length - 1][7] || 0
        );
    }

    let income = 0;
    let expense = 0;
    let balance = lastBalance;

    if (type === "รายรับ") {
        income = Number(amount);
        balance += income;
    } else {
        expense = Number(amount);
        balance -= expense;
    }

    // =======================
    // บันทึก Transaction
    // =======================

    await sheet.appendRow("Transactions", [
        crypto.randomUUID(), // id
        date,
        type,
        category,
        description,
        income,
        expense,
        balance,
        note || ""
    ]);

    return {
        success: true,
        message: "เพิ่มรายการสำเร็จ"
    };

};