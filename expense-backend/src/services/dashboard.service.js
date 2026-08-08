// backend/src/services/dashboard.service.js

const sheet = require("./sheet.service");

exports.getDashboard = async (userId) => {

    const rows = await sheet.getRows("Transactions");

    const transactions = rows
        .slice(1)
        .filter(row => {

            // row[1] = userId
            return String(row[1]) === String(userId);

        });


    // =========================
    // คำนวณ Summary
    // =========================

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(row => {

        totalIncome += Number(row[5] || 0);

        totalExpense += Number(row[6] || 0);

    });

    const balance =
        totalIncome - totalExpense;


    // =========================
    // รายการล่าสุด
    // =========================

    const latestTransactions = transactions
        .slice()
        .reverse()
        .slice(0, 5)
        .map(row => ({

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

            updateAt: row[10] || ""

        }));


    return {

        summary: {

            totalIncome,

            totalExpense,

            balance,

            totalTransactions:
                transactions.length

        },

        latestTransactions

    };

};