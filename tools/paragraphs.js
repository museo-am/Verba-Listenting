// Lists every paragraph in index.html as JSON lines {level, hash, text} for the Gemini generator.
// Hash = first 12 hex chars of SHA-1 of the paragraph text, exactly what the page requests.
const fs = require("fs"), crypto = require("crypto");
const html = fs.readFileSync(__dirname + "/../index.html", "utf8");
const src = html.slice(html.indexOf("const LESSONS"), html.indexOf("const LEVELS"));
const { LESSONS } = new Function(src + "; return { LESSONS };")();
const seen = new Set();
for (const l of LESSONS) for (const p of l.text) {
  const hash = crypto.createHash("sha1").update(p, "utf8").digest("hex").slice(0, 12);
  if (seen.has(hash)) continue; seen.add(hash);
  console.log(JSON.stringify({ level: l.level, hash, text: p }));
}
