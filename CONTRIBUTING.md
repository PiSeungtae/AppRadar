# Contributing

## Adding a Source

1. Create `src/adapters/yourSource.ts`
2. Export one function: `fetchListing(appId: string)`
3. Return a `Listing` or `null` if the app is not found
4. Register it in `src/adapters/index.ts`

See `src/adapters/README.md` for the full field reference.

## Scoring Weights

The weights in `src/scoring/engine.ts` are intentional.
Changes need a data argument. Open an issue first.

## Running Locally

```bash
npm install
npm run dev
