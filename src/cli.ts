import { search } from "./scoring/index";

const appId = process.argv[2];

if (!appId) {
  console.log("Usage: npx tsx src/cli.ts <appId>");
  console.log("Example: npx tsx src/cli.ts ankidroid/Anki-Android");
  process.exit(1);
}

console.log(`\nSearching for: ${appId}\n`);

search(appId).then((results) => {
  if (results.length === 0) {
    console.log("No results found.");
    return;
  }

  results.forEach((r, i) => {
    const tag = r.recommended ? " ← BEST PICK" : "";
    console.log(`${i + 1}. [${r.source}] v${r.version}`);
    console.log(`   Score: ${Math.round(r.totalScore)} | Privacy: ${Math.round(r.scores.privacy)} | Freshness: ${Math.round(r.scores.freshness)} | Trust: ${Math.round(r.scores.trust)}${tag}`);
    console.log(`   ${r.url}\n`);
  });
});
