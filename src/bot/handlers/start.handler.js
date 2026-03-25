import { Composer } from "grammy";
import { content } from "../../config/content.js";
import { getMainKeyboard, getSiteKeyboard } from "../keyboards/main.keyboard.js";
import { config } from "../../config/index.js";

export const startHandler = new Composer();

/**
 * /start — вітальне повідомлення + головне меню.
 * Підтримує deep links: /start site_contact → зберігає source в session.
 */
startHandler.command("start", async (ctx) => {
  // Deep link: /start site_contact
  const payload = ctx.match;
  if (payload) {
    ctx.session.source = payload;
    console.log(`[deeplink] Source: ${payload} for user ${ctx.from?.id}`);
  }

  await ctx.reply(content.startMessage, { reply_markup: getMainKeyboard() });
  // Додатково показуємо inline-кнопку для сайту
  await ctx.reply("🔗", { reply_markup: getSiteKeyboard(config.siteUrl) });
});

