//expense-backend/src/services/transaction.service.js
const crypto = require("crypto");
const sheet = require("./sheet.service");

exports.getAll = async (userId) => {

    const rows = await sheet.getRows("Transactions");

    const transactions = rows.slice(1);

    const typeRows = (
        await sheet.getRows("Types")
    ).slice(1);

    const categoryRows = (
        await sheet.getRows("Categories")
    ).slice(1);

    return transactions
        .filter(row => String(row[1]) === String(userId))
        .map(row => {

            const type = typeRows.find(
                type =>
                    String(type[0]) === String(row[3])
            );

            const category = categoryRows.find(
                category =>
                    String(category[0]) === String(row[4])
            );

            return {

                id: row[0],

                userId: row[1],

                date: row[2],

                typeId: row[3],

                categoryId: row[4],

                income: Number(row[5] || 0),

                expense: Number(row[6] || 0),

                balance: Number(row[7] || 0),

                note: row[8] || "",

                createdAt: row[9] || "",

                updateAt: row[10] || "",

                // ชื่อที่ใช้แสดงบนหน้าเว็บ
                typeName: type?.[1] || "",

                categoryName: category?.[2] || ""

            };

        });

};

exports.create = async (userId, data) => {

    const {
        date,
        typeId,
        categoryId,
        amount,
        note
    } = data;

    if (!date || !typeId || !categoryId || !amount) {
        throw new Error("กรุณากรอกข้อมูลให้ครบ");
    }

    const money = Number(amount);

    if (isNaN(money) || money <= 0) {
        throw new Error("จำนวนเงินไม่ถูกต้อง");
    }

    const typeRows = await sheet.getRows("Types");

    const type = typeRows
        .slice(1)
        .find(row =>
            String(row[0]) === String(typeId)
        );

    if (!type) {
        throw new Error("ไม่พบประเภทที่เลือก");
    }

    const typeName = String(type[1] || "").trim();

    if (
        typeName !== "รายรับ" &&
        typeName !== "รายจ่าย"
    ) {
        throw new Error("ประเภทไม่ถูกต้อง");
    }

    const categoryRows = await sheet.getRows("Categories");

    const category = categoryRows
        .slice(1)
        .find(row =>
            String(row[0]) === String(categoryId)
        );

    if (!category) {
        throw new Error("ไม่พบหมวดหมู่ที่เลือก");
    }

    const categoryTypeId = category[1];

    if (
        String(categoryTypeId) !== String(typeId)
    ) {
        throw new Error(
            "หมวดหมู่นี้ไม่ได้อยู่ในประเภทที่เลือก"
        );
    }

    const transactionRows =
        (await sheet.getRows("Transactions"))
            .slice(1)
            .filter(row =>
                String(row[1]) === String(userId)
            );

    let lastBalance = 0;

    if (transactionRows.length > 0) {

        lastBalance = Number(
            transactionRows[
            transactionRows.length - 1
            ][7] || 0
        );

    }

    let income = 0;
    let expense = 0;
    let balance = lastBalance;

    if (typeName === "รายรับ") {

        income = money;
        balance += money;

    }

    if (typeName === "รายจ่าย") {

        expense = money;
        balance -= money;

    }

    const now = new Date().toISOString();

    await sheet.appendRow("Transactions", [

        crypto.randomUUID(),
        userId,
        date,
        typeId,
        categoryId,
        income,
        expense,
        balance,
        note || "",
        now,
        now

    ]);

    return {
        success: true,
        message: "เพิ่มรายการสำเร็จ"
    };

};

// UPDATE
exports.update = async (userId, id, data) => {

    const rows = await sheet.getRows("Transactions");

    const headers = rows[0];
    const transactions = rows.slice(1);

    const index = transactions.findIndex(
        row =>
            String(row[0]) === String(id) &&
            String(row[1]) === String(userId)
    );

    if (index === -1) {
        throw new Error("ไม่พบรายการ หรือไม่มีสิทธิ์แก้ไขรายการนี้");
    }

    const oldRow = transactions[index];

    const date = data.date ?? oldRow[2];
    const typeId = data.typeId ?? oldRow[3];
    const categoryId = data.categoryId ?? oldRow[4];
    const note = data.note ?? oldRow[8];

    let income = Number(oldRow[5] || 0);
    let expense = Number(oldRow[6] || 0);

    if (data.amount !== undefined) {

        const amount = Number(data.amount);

        if (isNaN(amount) || amount <= 0) {
            throw new Error("จำนวนเงินไม่ถูกต้อง");
        }

        const typeRows = await sheet.getRows("Types");

        const type = typeRows
            .slice(1)
            .find(row =>
                String(row[0]) === String(typeId)
            );

        if (!type) {
            throw new Error("ไม่พบประเภทที่เลือก");
        }

        const typeName = String(type[1] || "").trim();

        income = 0;
        expense = 0;

        if (typeName === "รายรับ") {
            income = amount;
        } else if (typeName === "รายจ่าย") {
            expense = amount;
        } else {
            throw new Error("ประเภทไม่ถูกต้อง");
        }
    }

    const categoryRows = await sheet.getRows("Categories");

    const category = categoryRows
        .slice(1)
        .find(row =>
            String(row[0]) === String(categoryId)
        );

    if (!category) {
        throw new Error("ไม่พบหมวดหมู่ที่เลือก");
    }

    if (String(category[1]) !== String(typeId)) {
        throw new Error(
            "หมวดหมู่นี้ไม่ได้อยู่ในประเภทที่เลือก"
        );
    }

    const newRow = [
        oldRow[0],
        oldRow[1],
        date,
        typeId,
        categoryId,
        income,
        expense,
        oldRow[7],
        note,
        oldRow[9],
        new Date().toISOString()
    ];

    await sheet.updateRow(
        "Transactions",
        id,
        {
            id: newRow[0],
            userId: newRow[1],
            date: newRow[2],
            typeId: newRow[3],
            categoryId: newRow[4],
            income: newRow[5],
            expense: newRow[6],
            balance: newRow[7],
            note: newRow[8],
            createdAt: newRow[9],
            updateAt: newRow[10]
        }
    );

    return {
        success: true,
        message: "แก้ไขรายการสำเร็จ"
    };
};

// DELETE
exports.remove = async (userId, id) => {

    const rows = await sheet.getRows("Transactions");

    const transactions = rows.slice(1);

    const transaction = transactions.find(
        row =>
            String(row[0]) === String(id) &&
            String(row[1]) === String(userId)
    );

    if (!transaction) {
        throw new Error("ไม่พบรายการ หรือไม่มีสิทธิ์ลบรายการนี้");
    }

    const ok = await sheet.deleteRow(
        "Transactions",
        id
    );

    if (!ok) {
        throw new Error("ลบรายการไม่สำเร็จ");
    }

    return {
        success: true,
        message: "ลบรายการสำเร็จ"
    };
};