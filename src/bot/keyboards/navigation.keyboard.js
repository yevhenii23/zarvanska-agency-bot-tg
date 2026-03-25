import { Keyboard } from "grammy";
import { content } from "../../config/content.js";

/**
 * Клавіатура з кнопками "Назад" і "Головне меню".
 */
export function getNavKeyboard() {
  return new Keyboard()
    .text(content.nav.back)
    .text(content.nav.home)
    .resized()
    .oneTime();
}

/**
 * Клавіатура з варіантами відповіді + навігація.
 */
export function getOptionsKeyboard(options) {
  const kb = new Keyboard();
  for (const opt of options) {
    kb.text(opt).row();
  }
  kb.text(content.nav.back).text(content.nav.home);
  return kb.resized().oneTime();
}

/**
 * Кнопка "Повернутись у головне меню" після завершення сценарію.
 */
export function getBackToMenuKeyboard() {
  return new Keyboard()
    .text(content.nav.backToMenu)
    .resized()
    .oneTime();
}
