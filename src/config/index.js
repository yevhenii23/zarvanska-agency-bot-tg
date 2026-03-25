import "dotenv/config";

export const config = {
  botToken: process.env.BOT_TOKEN,
  isDev: process.env.NODE_ENV !== "production",
  teamChatId: process.env.TEAM_CHAT_ID || null,
  siteUrl: process.env.SITE_URL || "https://zarvanska.agency",
  google: {
    credentials: process.env.GOOGLE_CREDENTIALS || null,
    sheetId: process.env.GOOGLE_SHEET_ID || null,
  },
};

export function validateConfig() {
  if (!config.botToken) {
    throw new Error("BOT_TOKEN is not set in .env file");
  }
}
