import { fetchListing as fdroid } from "./fdroid";
import { fetchListing as github } from "./github";
import { AdapterFn } from "./types";

export const adapters: AdapterFn[] = [fdroid, github];

export async function queryAll(appId: string) {
  const results = await Promise.allSettled(
    adapters.map((adapter) => adapter(appId))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<Awaited<ReturnType<AdapterFn>>> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value);
}
