# AppRadar

AppRadar tells you which version of an app is the best one to install, and where to get it.

It compares the same app across multiple stores and sources, then scores each listing based on privacy, update frequency, open-source status, user ratings, and price. You get one clear answer instead of searching five platforms yourself.

---

## The Problem

The same app exists on multiple platforms. The versions are not always identical.

- The Play Store version of a browser might ship with more trackers than the F-Droid build.
- The GitHub release might be newer than the APKPure mirror by three weeks.
- One store might be the only place offering the app for free.

Most people install from wherever they find the app first. AppRadar shows you whether that was the right call.

---

## What It Does

1. You search for an app by name or package ID.
2. AppRadar queries all configured sources in parallel.
3. Each listing gets a score across five dimensions.
4. You see a ranked comparison table and a recommended pick.

---

## Score Dimensions

| Dimension       | Weight | What It Measures                                      |
|-----------------|--------|-------------------------------------------------------|
| Privacy         | 30%    | Tracker count from Exodus Privacy, permissions diff   |
| Freshness       | 25%    | Days since last update vs. upstream release           |
| Source Trust    | 20%    | Open source, signed releases, known maintainer        |
| User Signal     | 15%    | Rating count and score, weighted by review volume     |
| Cost            | 10%    | Free vs paid vs freemium, presence of ads             |

---

## Supported Sources

- Google Play Store
- Apple App Store
- F-Droid
- IzzyOnDroid
- APKPure
- APKMirror
- GitHub Releases
- Obtainium-compatible sources
- Huawei AppGallery (partial)
- Amazon Appstore

Adding a new source takes one adapter file. See `src/adapters/README.md`.

---

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js (Express)
- Scoring engine: TypeScript
- Data cache: Redis (optional, degrades gracefully)
- Privacy data: Exodus Privacy API
- Scraping fallback: Playwright (headless)

---

## Project Structure

```
appradar/
├── src/
│   ├── adapters/          # One file per store/source
│   │   ├── playstore.ts
│   │   ├── fdroid.ts
│   │   ├── apkmirror.ts
│   │   ├── github.ts
│   │   └── README.md
│   ├── scoring/
│   │   ├── engine.ts      # Aggregates dimension scores
│   │   ├── privacy.ts
│   │   ├── freshness.ts
│   │   └── trust.ts
│   ├── api/
│   │   ├── routes.ts
│   │   └── middleware.ts
│   └── frontend/
│       ├── App.tsx
│       ├── components/
│       │   ├── SearchBar.tsx
│       │   ├── ResultCard.tsx
│       │   ├── ScoreBreakdown.tsx
│       │   └── SourceBadge.tsx
│       └── styles/
├── tests/
├── docs/
│   ├── adapters.md
│   ├── scoring.md
│   └── self-hosting.md
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Quickstart

```bash
git clone https://github.com/yourname/appradar.git
cd appradar
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. No API key required for basic use.

For Play Store data, you need a Google Play scraping token or an unofficial API key. See `docs/setup.md`.

---

## Writing an Adapter

Each adapter exports a single async function:

```typescript
export async function fetchListing(appId: string): Promise<Listing | null> {
  // fetch data from your source
  return {
    source: "fdroid",
    appId,
    version: "1.4.2",
    lastUpdated: new Date("2025-03-10"),
    isOpenSource: true,
    trackerCount: 0,
    rating: null,
    ratingCount: null,
    price: 0,
    url: `https://f-droid.org/packages/${appId}/`,
  };
}
```

That is the full interface. AppRadar handles the rest.

---

## Self-Hosting

AppRadar runs entirely on your machine. No telemetry. No account required.

Docker:

```bash
docker compose up
```

See `docs/self-hosting.md` for reverse proxy config and Redis setup.

---

## Roadmap

- [ ] Browser extension (auto-suggest better source on app pages)
- [ ] CLI tool (`appradar search com.example.app`)
- [ ] Watchlist with update alerts
- [ ] Side-by-side permission diff viewer
- [ ] iOS sources (AltStore, Sideloadly)
- [ ] FOSS score badge embeddable in GitHub READMEs

---

## Contributing

Read `CONTRIBUTING.md` before opening a PR. The scoring weights are intentional and changes to them need a data argument, not just an opinion.

---

## License

MIT
 
