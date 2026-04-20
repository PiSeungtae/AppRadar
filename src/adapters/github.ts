import { Listing, AdapterFn } from "./types";

export const fetchListing: AdapterFn = async (appId: string) => {
  // appId format for GitHub: "owner/repo"
  // e.g. "ankidroid/Anki-Android"
  if (!appId.includes("/")) return null;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${appId}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!res.ok) return null;
    const data = await res.json();

    return {
      source: "github",
      appId,
      appName: appId.split("/")[1],
      version: data.tag_name ?? "unknown",
      lastUpdated: data.published_at ? new Date(data.published_at) : null,
      isOpenSource: true,
      trackerCount: null,
      permissions: [],
      rating: null,
      ratingCount: null,
      price: 0,
      hasAds: false,
      url: data.html_url ?? `https://github.com/${appId}/releases`,
    };
  } catch {
    return null;
  }
};
