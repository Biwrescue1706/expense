// expense-backend/src/services/dashboard.service.js

const sheet = require("./sheet.service");

exports.getDashboard = async (userId) => {

    const transactionRows = await sheet.getRows("Transactions");
    const transactions = transactionRows.slice(1);

    // เฉพาะรายการของ User ที่ Login
    const myTransactions = transactions.filter(row => { return String(row[1] || "") === String(userId); });

    // คำนวณยอด
    let totalIncome = 0; let totalExpense = 0;
    myTransactions.forEach(row => {
        totalIncome += Number(row[5] || 0); totalExpense += Number(row[6] || 0);
    });

    const balance = totalIncome - totalExpense;

    // Types// id | name
    const typeRows = (await sheet.getRows("Types")).slice(1);

    // Categories// id | typeId | name
    const categoryRows = (await sheet.getRows("Categories")).slice(1);

    // รายการล่าสุด 5 รายการ
    const latestTransactions = myTransactions.slice().reverse().slice(0, 5).map(row => {
        const typeId = row[3];
        const categoryId = row[4];

        // หา Type จาก typeId            
        const type = typeRows.find(item => String(item[0]) === String(typeId));

        // หา Category จาก categoryId            
        const category = categoryRows.find(item => String(item[0]) === String(categoryId));

        return {
            id: row[0],
            userId: row[1],
            date: row[2],
            typeId: row[3],
            categoryId: row[4],
            typeName: type ? type[1] : "-",
            categoryName: category ? category[2] : "-",
            income: Number(row[5] || 0),
            expense: Number(row[6] || 0),
            balance: Number(row[7] || 0),
            note: row[8] || "",
            createdAt: row[9] || "",
            updateAt: row[10] || ""
        };
    });

    // ส่งข้อมูลกลับ
    return {
        summary: {
            totalIncome,
            totalExpense,
            balance,
            totalTransactions: myTransactions.length
        },
        latestTransactions
    };

};