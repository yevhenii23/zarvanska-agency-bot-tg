import { content } from "../../config/content.js";
import { processLead } from "../../services/lead.service.js";
import { getOptionsKeyboard, getNavKeyboard, getBackToMenuKeyboard } from "../keyboards/navigation.keyboard.js";
import { getMainKeyboard } from "../keyboards/main.keyboard.js";

/**
 * Сценарій 1: "Хочу працювати з агенцією"
 * 8 кроків збору брифу з підтримкою кнопки "Назад"
 */
export async function agencyConversation(conversation, ctx) {
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

  // Визначення кроків
  steps.push(
    // 0: Ім'я
    async () => {
      const answer = await askText(content.agency.questions[0]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.name = answer;
      data.type = content.menu.agency;
      return null;
    },
    // 1: Бренд
    async () => {
      const answer = await askText(content.agency.questions[1]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.brand = answer;
      return null;
    },
    // 2: Ніша
    async () => {
      const answer = await askText(content.agency.questions[2]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.niche = answer;
      return null;
    },
    // 3: Послуга (кнопки)
    async () => {
      const answer = await askOptions(content.agency.questions[3], content.agency.serviceOptions);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.service = answer;
      return null;
    },
    // 4: Посилання
    async () => {
      const answer = await askText(content.agency.questions[4]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.link = answer;
      return null;
    },
    // 5: Головний запит (кнопки)
    async () => {
      const answer = await askOptions(content.agency.questions[5], content.agency.goalOptions);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.goal = answer;
      return null;
    },
    // 6: Бюджет (кнопки)
    async () => {
      const answer = await askOptions(content.agency.questions[6], content.agency.budgetOptions);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.budget = answer;
      return null;
    },
    // 7: Формат зв'язку (кнопки)
    async () => {
      const answer = await askOptions(content.agency.questions[7], content.agency.contactOptions);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.contactFormat = answer;
      return null;
    },
  );

  // Виконання кроків з підтримкою "Назад"
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

  // Збереження заявки
  await processLead(ctx, "lead_agency", data);

  await ctx.reply(content.agency.finalMessage, {
    reply_markup: getBackToMenuKeyboard(),
  });
}
