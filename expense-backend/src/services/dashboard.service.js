const sheet = require("./sheet.service");

exports.getDashboard = async () => {

    const rows = (await sheet.getRows("Transactions")).slice(1);

    let totalIncome = 0;
    let totalExpense = 0;
    let balance = 0;

    const transactions = rows.map(row => {

        const income = Number(row[5] || 0);
        const expense = Number(row[6] || 0);
        const rowBalance = Number(row[7] || 0);

        totalIncome += income;
        totalExpense += expense;
        balance = rowBalance;

        return {
            id: row[0],
            date: row[1],
            type: row[2],
            category: row[3],
            description: row[4],
            income,
            expense,
            balance: rowBalance,
            note: row[8],
        };

    });

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {

        summary: {

            totalIncome,

            totalExpense,

            balance,

            totalTransactions: transactions.length,

        },

        latestTransactions: transactions.slice(0, 5),

    };

};