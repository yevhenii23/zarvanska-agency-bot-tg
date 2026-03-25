import { Keyboard, InlineKeyboard } from "grammy";
import { content } from "../../config/content.js";

/**
 * Reply-клавіатура головного меню (4 кнопки + inline для сайту).
 */
export function getMainKeyboard() {
  return new Keyboard()
    .text(content.menu.agency)
    .row()
    .text(content.menu.consultation)
    .row()
    .text(content.menu.team)
    .row()
    .text(content.menu.question)
    .resized()
    .oneTime();
}

/**
 * Inline-кнопка "Повернутись на сайт".
 */
export function getSiteKeyboard(url) {
  return new InlineKeyboard().url(content.menu.site, url);
}
