// src/scoring/engine.ts
// Takes an array of Listing objects and returns them ranked with scores.

import { Listing } from "../adapters/types";

export interface ScoredListing extends Listing {
  scores: {
    privacy: number;
    freshness: number;
    trust: number;
    userSignal: number;
    cost: number;
  };
  totalScore: number;
  recommended: boolean;
}

const WEIGHTS = {
  privacy: 0.30,
  freshness: 0.25,
  trust: 0.20,
  userSignal: 0.15,
  cost: 0.10,
};

function scorePrivacy(listing: Listing): number {
  if (listing.trackerCount === null) return 50;
  if (listing.trackerCount === 0) return 100;
  if (listing.trackerCount <= 2) return 70;
  if (listing.trackerCount <= 5) return 40;
  return 10;
}

function scoreFreshness(listing: Listing, allListings: Listing[]): number {
  if (!listing.lastUpdated) return 30;
  const now = Date.now();
  const daysSince = (now - listing.lastUpdated.getTime()) / 86400000;

  // Find the most recent update across all sources
  const mostRecent = allListings
    .filter((l) => l.lastUpdated)
    .reduce((best, l) =>
      l.lastUpdated!.getTime() > best.getTime() ? l.lastUpdated! : best,
      new Date(0)
    );

  const lag = Math.max(
    0,
    (mostRecent.getTime() - listing.lastUpdated.getTime()) / 86400000
  );

  // Penalize for lag behind the freshest source
  if (lag === 0) return 100;
  if (lag <= 7) return 80;
  if (lag <= 30) return 55;
  if (lag <= 90) return 30;
  return 10;
}

function scoreTrust(listing: Listing): number {
  let score = 50;
  if (listing.isOpenSource) score += 30;
  if (listing.source === "fdroid" || listing.source === "izzyondroid") score += 20;
  if (listing.source === "github") score += 10;
  if (listing.source === "apkpure" || listing.source === "apkmirror") score -= 10;
  return Math.min(100, Math.max(0, score));
}

function scoreUserSignal(listing: Listing): number {
  if (listing.rating === null || listing.ratingCount === null) return 50;
  const normalizedRating = (listing.rating / 5) * 100;
  // Weight by review volume (log scale)
  const volumeWeight = Math.min(1, Math.log10(listing.ratingCount + 1) / 5);
  return normalizedRating * volumeWeight + 50 * (1 - volumeWeight);
}

function scoreCost(listing: Listing): number {
  if (listing.price === 0 && listing.hasAds === false) return 100;
  if (listing.price === 0 && listing.hasAds === null) return 75;
  if (listing.price === 0 && listing.hasAds === true) return 40;
  if (listing.price > 0) return 60; // paid but clean
  return 50;
}

export function rankListings(listings: Listing[]): ScoredListing[] {
  const scored: ScoredListing[] = listings.map((listing) => {
    const scores = {
      privacy: scorePrivacy(listing),
      freshness: scoreFreshness(listing, listings),
      trust: scoreTrust(listing),
      userSignal: scoreUserSignal(listing),
      cost: scoreCost(listing),
    };

    const totalScore =
      scores.privacy * WEIGHTS.privacy +
      scores.freshness * WEIGHTS.freshness +
      scores.trust * WEIGHTS.trust +
      scores.userSignal * WEIGHTS.userSignal +
      scores.cost * WEIGHTS.cost;

    return { ...listing, scores, totalScore, recommended: false };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);
  if (scored.length > 0) scored[0].recommended = true;

  return scored;
}
