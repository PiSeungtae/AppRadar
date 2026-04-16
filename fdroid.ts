// src/adapters/fdroid.ts
// Queries the F-Droid index directly. No API key needed.

import { Listing, AdapterFn } from "./types";

const FDROID_INDEX = "https://f-droid.org/repo/index-v2.json";
const FDROID_BASE = "https://f-droid.org/packages";

interface FDroidPackage {
  metadata: {
    name?: Record<string, string>;
    summary?: Record<string, string>;
    description?: Record<string, string>;
    sourceCode?: string;
    antiFeatures?: Record<string, unknown>;
    categories?: string[];
  };
  versions: Record<
    string,
    {
      manifest: { versionName: string };
      added: number;
    }
  >;
}

export const fetchListing: AdapterFn = async (appId: string) => {
  try {
    const res = await fetch(`${FDROID_INDEX}`);
    if (!res.ok) return null;

    const data = await res.json();
    const pkg: FDroidPackage | undefined = data.packages?.[appId];
    if (!pkg) return null;

    const versions = Object.values(pkg.versions);
    const latest = versions.sort((a, b) => b.added - a.added)[0];

    const appName =
      pkg.metadata.name?.["en-US"] || pkg.metadata.name?.["en"] || appId;

    return {
      source: "fdroid",
      appId,
      appName,
      version: latest?.manifest.versionName ?? "unknown",
      lastUpdated: latest ? new Date(latest.added) : null,
      isOpenSource: true,
      trackerCount: 0, // F-Droid rejects apps with trackers
      permissions: [],
      rating: null,
      ratingCount: null,
      price: 0,
      hasAds: false,
      url: `${FDROID_BASE}/${appId}/`,
    } satisfies Listing;
  } catch {
    return null;
  }
};
