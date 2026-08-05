exports.rowsToObjects = (rows) => {

    if (!rows || rows.length === 0) return [];

    const headers = rows[0];

    return rows.slice(1).map(row => {

        let obj = {};

        headers.forEach((header, index) => {
            obj[header] = row[index] ?? "";
        });

        return obj;

    });

};