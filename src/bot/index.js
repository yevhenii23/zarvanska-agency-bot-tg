import { Bot, Composer } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { config } from "../config/index.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { sessionMiddleware } from "./middlewares/session.middleware.js";
import { startHandler } from "./handlers/start.handler.js";
import { menuHandler } from "./handlers/menu.handler.js";
import { content } from "../config/content.js";
import { getMainKeyboard, getSiteKeyboard } from "./keyboards/main.keyboard.js";
import { agencyConversation } from "./conversations/agency.conversation.js";
import { consultationConversation } from "./conversations/consultation.conversation.js";
import { teamConversation } from "./conversations/team.conversation.js";
import { questionConversation } from "./conversations/question.conversation.js";

/**
 * Створює та конфігурує екземпляр бота.
 */
export function createBot() {
  const bot = new Bot(config.botToken);

  // --- Middlewares (порядок важливий!) ---
  bot.use(loggerMiddleware());

  // --- Команда /chatid працює скрізь (і в групах) ---
  bot.command("chatid", async (ctx) => {
    await ctx.reply(
      `Chat ID: <code>${ctx.chat.id}</code>\nТип: ${ctx.chat.type}`,
      { parse_mode: "HTML" },
    );
  });

  // --- Ігнорувати все крім приватних чатів ---
  bot.use(async (ctx, next) => {
    if (ctx.chat?.type !== "private") return;
    await next();
  });

  // --- Session + Conversations (тільки приватні чати) ---
  bot.use(sessionMiddleware());
  bot.use(conversations());

  // --- Conversations ---
  bot.use(createConversation(agencyConversation, "agency"));
  bot.use(createConversation(consultationConversation, "consultation"));
  bot.use(createConversation(teamConversation, "team"));
  bot.use(createConversation(questionConversation, "question"));

  // --- Handlers ---
  bot.use(startHandler);
  bot.use(menuHandler);

  // --- Fallback: будь-яке повідомлення поза сценарієм → головне меню ---
  bot.on("message:text", async (ctx) => {
    await ctx.reply(content.startMessage, { reply_markup: getMainKeyboard() });
    await ctx.reply("🔗", { reply_markup: getSiteKeyboard(config.siteUrl) });
  });

  // --- Error handling ---
  bot.catch((err) => {
    const ctx = err.ctx;
    const e = err.error;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    console.error(e);
  });

  return bot;
}
