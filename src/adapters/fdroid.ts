import { Listing, AdapterFn } from "./types";

export const fetchListing: AdapterFn = async (appId: string) => {
  if (appId.includes("/")) return null;

  try {
    const res = await fetch(
      `https://f-droid.org/api/v1/packages/${appId}`
    );
    if (!res.ok) return null;
    const data = await res.json();

    const latest = data.packages?.[0];

    return {
      source: "fdroid",
      appId,
      appName: data.name ?? appId,
      version: latest?.versionName ?? "unknown",
      lastUpdated: latest?.added ? new Date(latest.added) : null,
      isOpenSource: true,
      trackerCount: 0,
      permissions: [],
      rating: null,
      ratingCount: null,
      price: 0,
      hasAds: false,
      url: `https://f-droid.org/packages/${appId}/`,
    };
  } catch {
    return null;
  }
};
