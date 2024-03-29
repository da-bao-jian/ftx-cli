import PQueue from 'p-queue';

/**
 * Do not send more than 6 orders total per 200ms by default.
 *
 * Current FTX base-level account order placement rate limits:
 *
 * - Soft limit: 2/200ms
 * - Hard limit: 6/200ms
 *
 * We implement 'dynamic' rate limits by retrying queued order requests which
 * throw rate limit exceptions.
 *
 * Users have the option to override the maximum number of orders placed per
 * 200ms for accounts in higher/VIP tiers (more lenient rate limits) and forward
 * compatibility (not forcing updates when FTX change rate limits).
 *
 * REF: https://help.ftx.com/hc/en-us/articles/360052595091-Ratelimits-on-FTX
 */
function create({ intervalLimit, intervalMs }) {
  const queue = new PQueue({
    interval: intervalMs,
    intervalCap: intervalLimit,

    /**
     * If the next interval begins with pending promises, they will carry over
     * and count towards its interval limit.
     */
    carryoverConcurrencyCount: true,
  });

  queue.on('error', () => {
    /**
     * TODO: Order queue error flow:
     *
     * 1. Pause queue
     * 2. Prompt user with 'An order sent as part of this action failed to
     * be placed. How would you like to continue?'
     * 3. Ignore and continue? Continue queue
     * 4. Cancel queued orders? Clear queue: `orders.clear()`
     * 5. Cancel queued and existing orders? Clear queue and cancel via API
     * 6. *If prompt is shown, add a 60s timeout before ignoring and continuing so
     * we don't get stuck waiting forever
     *
     * Also add inline/config options to customise behaviour:
     *
     * - `ORDER_REJECTION_ACTION` [prompt (default)|ignore|cancel-queued|cancel-all]
     *
     * We should probably halt execution if the error is unhandled.
     */
  });

  return queue;
}

const orders = { create };

export { orders };
