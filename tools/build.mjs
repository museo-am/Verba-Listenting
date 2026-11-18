// Verba School: encrypt the private lessons for the public site.
//
//   VERBA_ADMIN_PASSWORD='...' node tools/build.mjs
//
// Reads   private/lessons.json, private/audio/<id>.mp3 + <id>.json (from tools/align.py)
// Writes  content/<id>.bin   lesson text, questions and sentence timings (AES-256-GCM)
//         audio/<id>.bin     recording (AES-256-GCM)
//         admin.json         master secret + lesson list, locked with the admin password
//
// Each lesson's key is HMAC-SHA256(master, "<id>:<v>"). A student link carries only that
// one key, so it opens one lesson. Raising a lesson's "v" in lessons.json and rebuilding
// makes every old link for that lesson stop working. The tutor panel does the same with
// its "Nuevo enlace" button; this build keeps the higher version, so it never undoes that.
// Nothing in private/ is ever committed (.gitignore).

import fs from "node:fs";
import path from "node:path";

const { subtle } = globalThis.crypto;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const P = (...a) => path.join(ROOT, ...a);
const ITER = 600000;
const enc = (s) => new TextEncoder().encode(s);
const b64 = (u8) => Buffer.from(u8).toString("base64");
const b64u = (u8) => Buffer.from(u8).toString("base64url");
const unb64 = (s) => new Uint8Array(Buffer.from(s, "base64"));

// must match split() in tools/align.py
export const splitSentences = (p) =>
  (p.match(/[^.!?¿¡]*[¿¡]?[^.!?]*[.!?]+/g) || [p]).map((t) => t.trim()).filter(Boolean);

async function hmac(keyBytes, data) {
  const k = await subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await subtle.sign("HMAC", k, data));
}
export async function lessonKey(master, id, v) {
  return hmac(master, enc(`${id}:${v}`));
}
// Deterministic IV (derived from key + plaintext) so unchanged files stay byte-identical between builds.
async function seal(rawKey, plain) {
  const iv = (await hmac(rawKey, plain)).slice(0, 12);
  const k = await subtle.importKey("raw", rawKey, "AES-GCM", false, ["encrypt"]);
  const ct = new Uint8Array(await subtle.encrypt({ name: "AES-GCM", iv }, k, plain));
  const out = new Uint8Array(12 + ct.length);
  out.set(iv); out.set(ct, 12);
  return out;
}
async function pwKey(pw, salt, iter) {
  const base = await subtle.importKey("raw", enc(pw), "PBKDF2", false, ["deriveKey"]);
  return subtle.deriveKey({ name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" }, base,
    { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
export async function openAdmin(adminJson, pw) {
  const a = adminJson;
  const k = await pwKey(pw, unb64(a.salt), a.iter);
  const plain = await subtle.decrypt({ name: "AES-GCM", iv: unb64(a.iv) }, k, unb64(a.ct));
  return JSON.parse(new TextDecoder().decode(plain));
}

// stable shuffle: Fisher–Yates driven by SHA-256 of the seed string
async function seededOrder(seed, n) {
  const bytes = new Uint8Array(await subtle.digest("SHA-256", enc(seed)));
  const order = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = bytes[i % bytes.length] % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function writeIfChanged(file, bytes) {
  if (fs.existsSync(file) && Buffer.compare(fs.readFileSync(file), Buffer.from(bytes)) === 0) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes);
  return true;
}

async function main() {
  const pw = process.env.VERBA_ADMIN_PASSWORD;
  if (!pw || pw.length < 12) throw new Error("Set VERBA_ADMIN_PASSWORD (at least 12 characters).");
  const lessons = JSON.parse(fs.readFileSync(P("private/lessons.json"), "utf8"));

  // master secret: reuse the one inside admin.json so existing links keep working
  let master, salt, gh = null, adminV = {};
  if (fs.existsSync(P("admin.json"))) {
    const a = JSON.parse(fs.readFileSync(P("admin.json"), "utf8"));
    let inner;
    try { inner = await openAdmin(a, pw); } catch { throw new Error("Wrong password for the existing admin.json."); }
    master = unb64(inner.master); salt = unb64(a.salt);
    gh = inner.gh || null;                                   // GitHub key saved from the tutor panel
    for (const c of inner.lessons || []) adminV[c.id] = c.v; // link versions changed from the panel
  } else {
    master = crypto.getRandomValues(new Uint8Array(32));
    salt = crypto.getRandomValues(new Uint8Array(16));
    console.log("Created a new master secret.");
  }

  const catalog = [];
  let lessonsChanged = false;
  const keep = new Set();
  let changed = 0;
  for (const l of lessons) {
    const v = Math.max(l.v || 1, adminV[l.id] || 1);
    if (v !== l.v) { l.v = v; lessonsChanged = true; }
    const key = await lessonKey(master, l.id, v);
    const sents = l.text.map(splitSentences);
    const count = sents.flat().length;
    let rec = null;
    const tj = P("private/audio", `${l.id}.json`), mp3 = P("private/audio", `${l.id}.mp3`);
    if (fs.existsSync(tj) && fs.existsSync(mp3)) {
      rec = JSON.parse(fs.readFileSync(tj, "utf8"));
      if (rec.starts.length !== count) throw new Error(`${l.id}: timings have ${rec.starts.length} sentences, text has ${count}. Re-run tools/align.py.`);
      if (writeIfChanged(P("audio", `${l.id}.bin`), await seal(key, new Uint8Array(fs.readFileSync(mp3))))) changed++;
      keep.add(`audio/${l.id}.bin`);
    }
    const data = { id: l.id, level: l.level, title: l.title, topic: l.topic, summary: l.summary,
      narrator: l.narrator, sents, gloss: l.gloss, q: l.q, rec };
    if (writeIfChanged(P("content", `${l.id}.bin`), await seal(key, enc(JSON.stringify(data))))) changed++;
    keep.add(`content/${l.id}.bin`);
    catalog.push({ id: l.id, v, level: l.level, title: l.title, topic: l.topic, narrator: l.narrator, audio: !!rec });
  }

  // level tests (private/tests.json): same encryption and links as lessons, kind "test".
  // Options are written correct-first; they are shuffled here with a fixed seed per question,
  // so the order is stable between builds and the answer is not always the first option.
  const testsFile = P("private/tests.json");
  const tests = fs.existsSync(testsFile) ? JSON.parse(fs.readFileSync(testsFile, "utf8")) : [];
  let testsChanged = false;
  for (const t of tests) {
    const v = Math.max(t.v || 1, adminV[t.id] || 1);
    if (v !== t.v) { t.v = v; testsChanged = true; }
    const key = await lessonKey(master, t.id, v);
    let qn = 0;
    const sections = [];
    for (const [si, s] of t.sections.entries()) {
      const q = [];
      for (const [qi, [prompt, opts]] of s.q.entries()) {
        const order = await seededOrder(`${t.id}:${si}:${qi}`, opts.length);
        q.push([prompt, order.map((i) => opts[i]), order.indexOf(0)]);
        qn++;
      }
      sections.push({ title: s.title, intro: s.intro, ...(s.text ? { text: s.text } : {}), q });
    }
    const data = { id: t.id, kind: "test", level: t.level, title: t.title, topic: t.topic,
      pass: t.pass || 0.7, minutes: t.minutes || 20, sections };
    if (writeIfChanged(P("content", `${t.id}.bin`), await seal(key, enc(JSON.stringify(data))))) changed++;
    keep.add(`content/${t.id}.bin`);
    catalog.push({ id: t.id, v, kind: "test", level: t.level, title: t.title, topic: t.topic, questions: qn, pass: data.pass, audio: false });
  }
  if (testsChanged) fs.writeFileSync(testsFile, JSON.stringify(tests, null, 1));

  // remove files for lessons that no longer exist
  for (const dir of ["content", "audio"]) {
    if (!fs.existsSync(P(dir))) continue;
    for (const f of fs.readdirSync(P(dir))) if (!keep.has(`${dir}/${f}`)) { fs.unlinkSync(P(dir, f)); changed++; }
  }

  // admin.json (deterministic IV from the inner content so it only changes when the catalog does)
  if (lessonsChanged) fs.writeFileSync(P("private/lessons.json"), JSON.stringify(lessons, null, 1));
  const inner = enc(JSON.stringify({ master: b64(master), lessons: catalog, ...(gh ? { gh } : {}) }));
  const k = await pwKey(pw, salt, ITER);
  const iv = (await hmac(master, inner)).slice(0, 12);
  const ct = new Uint8Array(await subtle.encrypt({ name: "AES-GCM", iv }, k, inner));
  const admin = JSON.stringify({ v: 1, iter: ITER, salt: b64(salt), iv: b64(iv), ct: b64(ct) }, null, 1) + "\n";
  if (writeIfChanged(P("admin.json"), enc(admin))) changed++;

  // pages ask for style.css by its content hash, so a cached old stylesheet is never paired with a new page
  const cssHash = (await subtle.digest("SHA-256", fs.readFileSync(P("style.css")))).slice(0, 4);
  const ver = Buffer.from(cssHash).toString("hex");
  for (const page of ["index.html", "admin.html"]) {
    const html = fs.readFileSync(P(page), "utf8");
    const next = html.replace(/href="style\.css(\?v=[0-9a-f]*)?"/, `href="style.css?v=${ver}"`);
    if (next !== html) { fs.writeFileSync(P(page), next); changed++; }
  }

  console.log(`${lessons.length} lessons, ${catalog.filter((c) => c.audio).length} with recordings, ${tests.length} tests, ${changed} files updated.`);
  if (process.env.VERBA_PRINT_LINKS) {
    for (const c of catalog) console.log(`${c.id}~${b64u(await lessonKey(master, c.id, c.v))}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
