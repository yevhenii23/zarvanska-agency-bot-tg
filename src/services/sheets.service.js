import { config } from "../config/index.js";

/**
 * Записує заявку в Google Sheets.
 * Поки що — заглушка з логуванням. Підключити коли буде service account.
 */
export async function saveToSheets(lead) {
  if (!config.google.credentials || !config.google.sheetId) {
    console.log("[sheets] Google Sheets not configured, logging lead locally:");
    console.log("[sheets]", JSON.stringify(lead, null, 2));
    return;
  }

  // TODO: підключити Google Sheets API
  // const { google } = await import("googleapis");
  // const auth = new google.auth.GoogleAuth({
  //   keyFile: config.google.credentials,
  //   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  // });
  // const sheets = google.sheets({ version: "v4", auth });
  // await sheets.spreadsheets.values.append({
  //   spreadsheetId: config.google.sheetId,
  //   range: "Sheet1!A:L",
  //   valueInputOption: "USER_ENTERED",
  //   requestBody: {
  //     values: [[
  //       lead.date,
  //       lead.username || "",
  //       lead.name || "",
  //       lead.type,
  //       lead.brand || "",
  //       lead.niche || "",
  //       lead.service || lead.role || lead.consultTopic || lead.questionText || "",
  //       lead.link || "",
  //       lead.budget || "",
  //       lead.contactFormat || "",
  //       lead.source || "",
  //       JSON.stringify(lead),
  //     ]],
  //   },
  // });
}
