import { validateConfig } from "./src/config/index.js";
import { createBot } from "./src/bot/index.js";

// --- Composition Root ---
validateConfig();

const bot = createBot();

// --- Graceful Shutdown ---
function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down...`);
  bot.stop();
  process.exit(0);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

// --- Start ---
console.log("🤖 Bot is starting...");

// Реєстрація команд тільки для приватних чатів
await bot.api.setMyCommands(
  [{ command: "start", description: "Головне меню" }],
  { scope: { type: "all_private_chats" } },
);
// Прибрати команди з груп
await bot.api.setMyCommands([], { scope: { type: "all_group_chats" } });

bot.start({ drop_pending_updates: true });
