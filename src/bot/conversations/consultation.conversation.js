import { content } from "../../config/content.js";
import { processLead } from "../../services/lead.service.js";
import { getOptionsKeyboard, getNavKeyboard, getBackToMenuKeyboard } from "../keyboards/navigation.keyboard.js";
import { getMainKeyboard } from "../keyboards/main.keyboard.js";

/**
 * Сценарій 2: "Хочу консультацію"
 * 4 кроки з підтримкою "Назад"
 */
export async function consultationConversation(conversation, ctx) {
  const data = {};
  const steps = [];
  let stepIndex = 0;

  const askText = async (questionText) => {
    await ctx.reply(questionText, { reply_markup: getNavKeyboard() });
    const response = await conversation.waitFor("message:text");
    return response.message.text;
  };

  const askOptions = async (questionText, options) => {
    await ctx.reply(questionText, { reply_markup: getOptionsKeyboard(options) });
    const response = await conversation.waitFor("message:text");
    return response.message.text;
  };

  steps.push(
    // 0: Ім'я
    async () => {
      const answer = await askText(content.consultation.questions[0]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.name = answer;
      data.type = content.menu.consultation;
      return null;
    },
    // 1: Посилання на бренд
    async () => {
      const answer = await askText(content.consultation.questions[1]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.link = answer;
      return null;
    },
    // 2: Що розібрати
    async () => {
      const answer = await askText(content.consultation.questions[2]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.consultTopic = answer;
      return null;
    },
    // 3: Формат (кнопки)
    async () => {
      const answer = await askOptions(content.consultation.questions[3], content.consultation.formatOptions);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.contactFormat = answer;
      return null;
    },
  );

  while (stepIndex < steps.length) {
    const result = await steps[stepIndex]();

    if (result === content.nav.home) {
      await ctx.reply(content.startMessage, { reply_markup: getMainKeyboard() });
      return;
    }
    if (result === content.nav.back) {
      if (stepIndex > 0) stepIndex--;
      continue;
    }
    stepIndex++;
  }

  await processLead(ctx, "lead_consultation", data);

  await ctx.reply(content.consultation.finalMessage, {
    reply_markup: getBackToMenuKeyboard(),
  });
}
