import { queryAll } from "../adapters/index";
import { rankListings } from "./engine";

export async function search(appId: string) {
  const listings = await queryAll(appId);
  if (listings.length === 0) return [];
  return rankListings(listings);
    }
