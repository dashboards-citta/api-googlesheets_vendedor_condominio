const { google } = require("googleapis");
require('dotenv').config();

const getAuthSheets = async ()=> {
  const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_CREDENTIALS_JSON 

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const spreadsheetId = process.env.SPREADSHEETID;

  return {
    auth,
    client,
    googleSheets,
    spreadsheetId,
  };
}

module.exports = getAuthSheets;