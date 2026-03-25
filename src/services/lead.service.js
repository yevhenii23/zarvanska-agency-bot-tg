import { notifyTeam } from "./notification.service.js";
import { saveToSheets } from "./sheets.service.js";

/**
 * Обробляє завершену заявку:
 * — додає метадані (дата, username, тег)
 * — зберігає в Sheets
 * — відправляє в чат команди
 */
export async function processLead(ctx, tag, data) {
  const lead = {
    date: new Date().toISOString(),
    username: ctx.from?.username || null,
    telegramId: ctx.from?.id,
    tag,
    source: ctx.session?.source || null,
    ...data,
  };

  console.log(`[lead] New lead: ${tag}`, lead);

  await Promise.all([
    saveToSheets(lead),
    notifyTeam(ctx, lead),
  ]);

  return lead;
}
