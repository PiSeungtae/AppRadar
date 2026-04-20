import { Listing, AdapterFn } from "./types";

export const fetchListing: AdapterFn = async (appId: string) => {
  if (appId.includes("/")) return null;

  try {
    const res = await fetch(
      `https://f-droid.org/api/v1/packages/${appId}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;

    const latest = data.packages?.[0];
    if (!latest) return null;

    return {
      source: "fdroid",
      appId,
      appName: data.packageName ?? appId,
      version: latest.versionName ?? "unknown",
      lastUpdated: null,
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
