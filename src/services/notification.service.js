import { config } from "../config/index.js";

/**
 * Відправляє структуровану заявку в Telegram-чат команди.
 */
export async function notifyTeam(ctx, lead) {
  if (!config.teamChatId) {
    console.log("[notification] TEAM_CHAT_ID not set, skipping notification");
    console.log("[notification] Lead data:", JSON.stringify(lead, null, 2));
    return;
  }

  const message = formatLeadMessage(lead);

  await ctx.api.sendMessage(config.teamChatId, message, {
    parse_mode: "HTML",
  });
}

function formatLeadMessage(lead) {
  const lines = [`<b>📩 Новий запит із сайту</b>`];
  lines.push(`<b>Тип:</b> ${lead.type}`);
  lines.push(`<b>Тег:</b> #${lead.tag}`);
  lines.push("");

  if (lead.name) lines.push(`<b>Ім'я:</b> ${lead.name}`);
  if (lead.username) lines.push(`<b>Telegram:</b> @${lead.username}`);
  if (lead.brand) lines.push(`<b>Бренд:</b> ${lead.brand}`);
  if (lead.niche) lines.push(`<b>Ніша:</b> ${lead.niche}`);
  if (lead.service) lines.push(`<b>Послуга:</b> ${lead.service}`);
  if (lead.role) lines.push(`<b>Роль:</b> ${lead.role}`);
  if (lead.link) lines.push(`<b>Посилання:</b> ${lead.link}`);
  if (lead.goal) lines.push(`<b>Головний запит:</b> ${lead.goal}`);
  if (lead.budget) lines.push(`<b>Бюджет:</b> ${lead.budget}`);
  if (lead.contactFormat) lines.push(`<b>Формат зв'язку:</b> ${lead.contactFormat}`);
  if (lead.about) lines.push(`<b>Про себе:</b> ${lead.about}`);
  if (lead.experience) lines.push(`<b>Досвід:</b> ${lead.experience}`);
  if (lead.city) lines.push(`<b>Місто:</b> ${lead.city}`);
  if (lead.testTask) lines.push(`<b>Тестове:</b> ${lead.testTask}`);
  if (lead.questionText) lines.push(`<b>Питання:</b> ${lead.questionText}`);
  if (lead.consultTopic) lines.push(`<b>Тема консультації:</b> ${lead.consultTopic}`);
  if (lead.source) lines.push(`\n<b>Джерело:</b> ${lead.source}`);

  return lines.join("\n");
}
