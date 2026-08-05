const sheets = require("../config/google");

const spreadsheetId = process.env.SHEET_ID;

// อ่านทั้งหมด
async function getRows(sheetName) {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: sheetName,
    });

    return response.data.values || [];
}

// เพิ่มข้อมูล
async function appendRow(sheetName, row) {

    await sheets.spreadsheets.values.append({

        spreadsheetId,

        range: sheetName,

        valueInputOption: "USER_ENTERED",

        requestBody: {

            values: [row],

        },

    });

}

// หา id ล่าสุด
async function nextId(sheetName) {

    const rows = await getRows(sheetName);

    if (rows.length === 0) return 1;

    const max = Math.max(

        ...rows.map(r => Number(r.id))

    );

    return max + 1;

}

// ค้นหา id
async function findById(sheetName, id) {

    const rows = await getRows(sheetName);

    return rows.find(r => r.id == id);

}

// ค้นหา 1 รายการ
async function findOne(sheetName, key, value) {

    const rows = await getRows(sheetName);

    return rows.find(r => r[key] == value);

}


// อัปเดต
async function updateRow(sheetName, id, data) {

    const response = await sheets.spreadsheets.values.get({

        spreadsheetId,

        range: sheetName,

    });

    const values = response.data.values;

    if (!values || values.length === 0) return false;

    const headers = values[0];

    const index = values.findIndex((r, i) => i > 0 && r[0] == id);

    if (index === -1) return false;

    const row = headers.map(h => data[h] ?? "");

    await sheets.spreadsheets.values.update({

        spreadsheetId,

        range: `${sheetName}!A${index + 1}`,

        valueInputOption: "USER_ENTERED",

        requestBody: {

            values: [row],

        },

    });

    return true;

}

// ลบ
async function deleteRow(sheetName, id) {

    const response = await sheets.spreadsheets.values.get({

        spreadsheetId,

        range: sheetName,

    });

    const values = response.data.values;

    if (!values) return false;

    const headers = values[0];

    const rows = values.slice(1);

    const newRows = rows.filter(r => r[0] != id);

    await sheets.spreadsheets.values.clear({

        spreadsheetId,

        range: sheetName,

    });

    await sheets.spreadsheets.values.append({

        spreadsheetId,

        range: sheetName,

        valueInputOption: "RAW",

        requestBody: {

            values: [

                headers,

                ...newRows,

            ],

        },

    });

    return true;

}

module.exports = {

    getRows,

    appendRow,

    nextId,

    findById,

    findOne,

    updateRow,

    deleteRow,

};