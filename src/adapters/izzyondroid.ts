import { Listing, AdapterFn } from "./types";

const IZZY_INDEX =
  "https://apt.izzysoft.de/fdroid/repo/index-v2.json";

export const fetchListing: AdapterFn = async (appId: string) => {
  try {
    const res = await fetch(IZZY_INDEX);
    if (!res.ok) return null;

    const data = await res.json();
    const pkg = data.packages?.[appId];
    if (!pkg) return null;

    const versions = Object.values(pkg.versions) as any[];
    const latest = versions.sort((a, b) => b.added - a.added)[0];

    const appName =
      pkg.metadata?.name?.["en-US"] ||
      pkg.metadata?.name?.["en"] ||
      appId;

    return {
      source: "izzyondroid",
      appId,
      appName,
      version: latest?.manifest?.versionName ?? "unknown",
      lastUpdated: latest ? new Date(latest.added) : null,
      isOpenSource: true,
      trackerCount: null,
      permissions: [],
      rating: null,
      ratingCount: null,
      price: 0,
      hasAds: false,
      url: `https://apt.izzysoft.de/fdroid/index/apk/${appId}`,
    };
  } catch {
    return null;
  }
};
