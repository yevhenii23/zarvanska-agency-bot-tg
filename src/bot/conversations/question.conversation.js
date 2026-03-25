import { content } from "../../config/content.js";
import { processLead } from "../../services/lead.service.js";
import { getNavKeyboard, getBackToMenuKeyboard } from "../keyboards/navigation.keyboard.js";
import { getMainKeyboard } from "../keyboards/main.keyboard.js";

/**
 * Сценарій 4: "У мене швидке питання"
 * 1 крок — просто текстове повідомлення
 */
export async function questionConversation(conversation, ctx) {
  await ctx.reply(content.question.prompt, { reply_markup: getNavKeyboard() });

  const response = await conversation.waitFor("message:text");
  const answer = response.message.text;

  if (answer === content.nav.home) {
    await ctx.reply(content.startMessage, { reply_markup: getMainKeyboard() });
    return;
  }
  if (answer === content.nav.back) {
    await ctx.reply(content.startMessage, { reply_markup: getMainKeyboard() });
    return;
  }

  await processLead(ctx, "lead_question", {
    type: content.menu.question,
    questionText: answer,
  });

  await ctx.reply(content.question.finalMessage, {
    reply_markup: getBackToMenuKeyboard(),
  });
}
