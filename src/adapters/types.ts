export interface Listing {
  source: string;
  appId: string;
  appName: string;
  version: string;
  lastUpdated: Date | null;
  isOpenSource: boolean;
  trackerCount: number | null;
  permissions: string[];
  rating: number | null;
  ratingCount: number | null;
  price: number;
  hasAds: boolean | null;
  url: string;
  iconUrl?: string;
  description?: string;
}

export type AdapterFn = (appId: string) => Promise<Listing | null>;
