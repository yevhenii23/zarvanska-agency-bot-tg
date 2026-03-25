import { Composer } from "grammy";
import { content } from "../../config/content.js";
import { getMainKeyboard, getSiteKeyboard } from "../keyboards/main.keyboard.js";
import { config } from "../../config/index.js";

export const menuHandler = new Composer();

/**
 * Обробка натискань текстових кнопок головного меню.
 * Кожна кнопка запускає відповідну conversation.
 */
menuHandler.hears(content.menu.agency, async (ctx) => {
  await ctx.conversation.enter("agency");
});

menuHandler.hears(content.menu.consultation, async (ctx) => {
  await ctx.conversation.enter("consultation");
});

menuHandler.hears(content.menu.team, async (ctx) => {
  await ctx.conversation.enter("team");
});

menuHandler.hears(content.menu.question, async (ctx) => {
  await ctx.conversation.enter("question");
});

// "Повернутись на сайт" — inline URL кнопка
menuHandler.hears(content.menu.site, async (ctx) => {
  await ctx.reply("Перейдіть за посиланням:", {
    reply_markup: getSiteKeyboard(config.siteUrl),
  });
});

// "Повернутись у головне меню" — після завершення сценарію
menuHandler.hears(content.nav.backToMenu, async (ctx) => {
  await ctx.reply(content.startMessage, { reply_markup: getMainKeyboard() });
  await ctx.reply("🔗", { reply_markup: getSiteKeyboard(config.siteUrl) });
});

// "🏠 Головне меню" — навігаційна кнопка
menuHandler.hears(content.nav.home, async (ctx) => {
  await ctx.reply(content.startMessage, { reply_markup: getMainKeyboard() });
  await ctx.reply("🔗", { reply_markup: getSiteKeyboard(config.siteUrl) });
});
