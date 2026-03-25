/**
 * Middleware для логування вхідних оновлень.
 */
export function loggerMiddleware() {
  return async (ctx, next) => {
    const start = Date.now();
    const user = ctx.from?.username || ctx.from?.id || "unknown";
    const type = ctx.update.message ? "message" : ctx.update.callback_query ? "callback" : "other";

    console.log(`→ [${type}] from ${user}`);

    await next();

    const ms = Date.now() - start;
    console.log(`← [${type}] from ${user} (${ms}ms)`);
  };
}
