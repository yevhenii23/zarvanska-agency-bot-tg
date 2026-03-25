import { session } from "grammy";

/**
 * Session middleware — зберігає стан користувача між повідомленнями.
 * Потрібно для conversations plugin та deep link tracking.
 */
export function sessionMiddleware() {
  return session({
    initial: () => ({
      source: null,
    }),
  });
}
