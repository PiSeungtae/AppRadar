import { useState } from "react";

interface ScoreBreakdown {
  privacy: number;
  freshness: number;
  trust: number;
  userSignal: number;
  cost: number;
}

interface Result {
  source: string;
  appName: string;
  version: string;
  lastUpdated: string;
  trackerCount: number | null;
  rating: number | null;
  ratingCount: number | null;
  url: string;
  scores: ScoreBreakdown;
  totalScore: number;
  recommended: boolean;
}

const SOURCE_COLORS: Record<string, string> = {
  fdroid: "#22c55e",
  github: "#60a5fa",
  izzyondroid: "#a78bfa",
  playstore: "#0f9d58",
  apkmirror: "#e8710a",
};

const BAR_COLORS: Record<string, string> = {
  privacy: "#4ade80",
  freshness: "#60a5fa",
  trust: "#a78bfa",
  userSignal: "#facc15",
  cost: "#fb923c",
};

function scoreColor(n: number) {
  if (n >= 75) return "#4ade80";
  if (n >= 50) return "#facc15";
  return "#f87171";
}

function ResultCard({ result, index }: { result: Result; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const sourceColor = SOURCE_COLORS[result.source] || "#555";

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: result.recommended ? "#0b160b" : "#0e0e0e",
        border: result.recommended
          ? "1px solid #22c55e44"
          : "1px solid #1a1a1a",
        borderRadius: 10,
        padding: "16px 20px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {result.recommended && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, #22c55e, #4ade80, #22c55e)",
        }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#2a2a2a", width: 24 }}>
            {index + 1}
          </span>
          <div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: sourceColor,
                background: `${sourceColor}18`, padding: "2px 8px",
                borderRadius: 4, border: `1px solid ${sourceColor}33`,
              }}>
                {result.source}
              </span>
              {result.recommended && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "#22c55e",
                  background: "#22c55e18", padding: "2px 8px",
                  borderRadius: 4, border: "1px solid #22c55e33",
                }}>
                  Best Pick
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 5, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#666" }}>v{result.version}</span>
              <span style={{ fontSize: 12, color: "#444" }}>{result.lastUpdated}</span>
              {result.trackerCount !== null && (
                <span style={{ fontSize: 12, color: result.trackerCount === 0 ? "#4ade80" : "#f87171" }}>
                  {result.trackerCount === 0 ? "0 trackers" : `${result.trackerCount} trackers`}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(result.totalScore), fontFamily: "monospace", lineHeight: 1 }}>
            {Math.round(result.totalScore)}
          </div>
          <div style={{ fontSize: 9, color: "#333", letterSpacing: "0.1em", textTransform: "uppercase" }}>score</div>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #161616" }}>
          {Object.entries(result.scores).map(([key, val]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>{key}</span>
                <span style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>{Math.round(val)}</span>
              </div>
              <div style={{ height: 4, background: "#141414", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${val}%`, background: BAR_COLORS[key], borderRadius: 2 }} />
              </div>
            </div>
          ))}
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: 11, color: "#444", textDecoration: "underline", textUnderlineOffset: 3, display: "block", marginTop: 12, wordBreak: "break-all" }}
          >
            {result.url}
          </a>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setError(null);

    try {
      const res = await fetch(`/search?id=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.results);
    } catch {
      setError("Search failed. Check the app ID and try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#e5e5e5", fontFamily: "'IBM Plex Mono', monospace", padding: "40px 20px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "#2a2a2a", textTransform: "uppercase", marginBottom: 12 }}>
            app store intelligence
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.02em", color: "#f0f0f0", fontFamily: "sans-serif" }}>
            App<span style={{ color: "#22c55e" }}>Radar</span>
          </h1>
          <p style={{ marginTop: 10, fontSize: 14, color: "#444", lineHeight: 1.6, fontFamily: "sans-serif" }}>
            Find the best version of any app across every store and source.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
          <input
            type="text"
            placeholder="org.mozilla.firefox or ankidroid/Anki-Android"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              flex: 1, background: "#0e0e0e", border: "1px solid #1a1a1a",
              borderRadius: 8, padding: "12px 16px", fontSize: 13,
              color: "#e5e5e5", fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              background: "#22c55e", border: "none", borderRadius: 8,
              padding: "12px 20px", fontSize: 11, fontWeight: 700,
              color: "#080808", fontFamily: "inherit", letterSpacing: "0.15em",
              textTransform: "uppercase", cursor: "pointer",
            }}
          >
            Scan
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: 40, color: "#2a2a2a", fontSize: 13 }}>
            scanning sources...
          </div>
        )}

        {error && (
          <div style={{ color: "#f87171", fontSize: 13, marginBottom: 20 }}>{error}</div>
        )}

        {!loading && searched && results.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {results.map((r, i) => (
              <ResultCard key={r.source} result={r} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
  }
