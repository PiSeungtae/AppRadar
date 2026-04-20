import express from "express";
import { search } from "../scoring/index";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/search", async (req, res) => {
  const appId = req.query.id as string;

  if (!appId) {
    return res.status(400).json({ error: "Missing id parameter" });
  }

  try {
    const results = await search(appId);

    if (results.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    return res.json({
      query: appId,
      count: results.length,
      recommended: results[0],
      results,
    });
  } catch (err) {
    return res.status(500).json({ error: "Search failed" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`AppRadar API running on http://localhost:${PORT}`);
});
