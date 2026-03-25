import { content } from "../../config/content.js";
import { processLead } from "../../services/lead.service.js";
import { getOptionsKeyboard, getNavKeyboard, getBackToMenuKeyboard } from "../keyboards/navigation.keyboard.js";
import { getMainKeyboard } from "../keyboards/main.keyboard.js";

/**
 * Сценарій 3: "Хочу в команду"
 * 7 кроків з підтримкою "Назад"
 */
export async function teamConversation(conversation, ctx) {
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
      const answer = await askText(content.team.questions[0]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.name = answer;
      data.type = content.menu.team;
      return null;
    },
    // 1: Роль (кнопки)
    async () => {
      const answer = await askOptions(content.team.questions[1], content.team.roleOptions);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.role = answer;
      return null;
    },
    // 2: CV / портфоліо
    async () => {
      const answer = await askText(content.team.questions[2]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.link = answer;
      return null;
    },
    // 3: Про себе
    async () => {
      const answer = await askText(content.team.questions[3]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.about = answer;
      return null;
    },
    // 4: Досвід
    async () => {
      const answer = await askText(content.team.questions[4]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.experience = answer;
      return null;
    },
    // 5: Місто / часовий пояс
    async () => {
      const answer = await askText(content.team.questions[5]);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.city = answer;
      return null;
    },
    // 6: Тестове завдання (кнопки)
    async () => {
      const answer = await askOptions(content.team.questions[6], content.team.testTaskOptions);
      if (answer === content.nav.back || answer === content.nav.home) return answer;
      data.testTask = answer;
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

  await processLead(ctx, "lead_hiring", data);

  await ctx.reply(content.team.finalMessage, {
    reply_markup: getBackToMenuKeyboard(),
  });
}
