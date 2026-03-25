import { google } from "googleapis";
import { config } from "../config/index.js";

/**
 * Записує заявку в Google Sheets.
 */
export async function saveToSheets(lead) {
  if (!config.google.credentials || !config.google.sheetId) {
    console.log("[sheets] Google Sheets not configured, logging lead locally:");
    console.log("[sheets]", JSON.stringify(lead, null, 2));
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: config.google.credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.google.sheetId,
      range: "Sheet1!A:L",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date(lead.date).toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" }),
          lead.username || "",
          lead.name || "",
          lead.type || "",
          lead.brand || "",
          lead.niche || "",
          lead.service || lead.role || lead.consultTopic || lead.questionText || "",
          lead.link || "",
          lead.budget || "",
          lead.contactFormat || "",
          lead.source || "",
          lead.tag || "",
        ]],
      },
    });

    console.log("[sheets] Lead saved to Google Sheets");
  } catch (error) {
    console.error("[sheets] Failed to save lead:", error.message);
  }
}
