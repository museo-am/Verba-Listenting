// Lists every sentence in index.html as "voice<TAB>msVoice<TAB>path<TAB>text" for the audio generator.
// Uses the page's own LESSONS and splitSentences so file names always match what the page requests.
const fs = require("fs"), crypto = require("crypto");
const html = fs.readFileSync(__dirname + "/../index.html", "utf8");
const src = html.slice(html.indexOf("const LESSONS"), html.indexOf("const LEVELS"));
const { LESSONS, splitSentences } = new Function(src + "; return { LESSONS, splitSentences };")();
const VOICES = { elvira: "es-ES-ElviraNeural", alvaro: "es-ES-AlvaroNeural", dalia: "es-MX-DaliaNeural" };
const seen = new Set();
for (const l of LESSONS) for (const p of l.text) for (const t of splitSentences(p)) {
  const h = crypto.createHash("sha1").update(t, "utf8").digest("hex").slice(0, 12);
  for (const [id, ms] of Object.entries(VOICES)) {
    const path = `audio/${id}/${h}.mp3`;
    if (seen.has(path)) continue; seen.add(path);
    console.log([id, ms, path, t].join("\t"));
  }
}
