const { google } = require("googleapis");
const path = require("path");



const auth = new google.auth.GoogleAuth({
    keyFile: "gen-lang-client-0768194995-0e62b8f56df9.json",
    scopes: [
        "https://www.googleapis.com/auth/spreadsheets"
    ]
});

const sheets = google.sheets({
    version: "v4",
    auth
});

module.exports = sheets;