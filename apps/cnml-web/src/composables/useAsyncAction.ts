/**
 * Async action composable for Vue islands.
 *
 * Consolidates the try/catch + busy + error ref pattern that every
 * interactive island component repeats. Each component that performs
 * async work (sign, verify, generate, import) declares its own
 * error/busy refs and wraps every action in the same boilerplate.
 *
 * Usage:
 *   const { error, busy, run } = useAsyncAction();
 *   await run(async () => { /* domain logic *\/ });
 *   // error.value is set if the function throws
 *   // busy.value is true while the function runs
 */

import { ref } from "vue";

export function useAsyncAction() {
  const error = ref("");
  const busy = ref(false);

  async function run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    error.value = "";
    busy.value = true;
    try {
      return await fn();
    } catch (e) {
      error.value = (e as Error).message;
      return undefined;
    } finally {
      busy.value = false;
    }
  }

  return { error, busy, run };
}
