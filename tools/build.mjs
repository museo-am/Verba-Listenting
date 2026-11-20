// Verba School: encrypt the private lessons for the public site.
//
//   node tools/build.mjs
//
// Reads   private/lessons.json, private/audio/<id>.mp3 + <id>.json (from tools/align.py)
// Writes  c/<short>.bin       lesson text, questions and sentence timings (AES-256-GCM)
//         a/<short>.bin       recording (AES-256-GCM)
//         content/<id>.bin    small pointer that sends old long links to the short one
//         tutors/<user>.json each tutor's master secret + their lesson list, locked with their password
// Tutors and their passwords live in private/tutors.json.
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

// word translations: private/dict/<lang>.json maps each lower-case word form to [base form, Armenian];
// private/dict/overrides.json gives a different meaning for a word in one lesson
export const WORD_RE = /\p{L}+(?:['\u2019-]\p{L}+)*/gu;   // must match WORD_RE in index.html
const dictCache = {};
function dictFor(lang) {
  if (!(lang in dictCache)) {
    const f = P("private/dict", `${lang}.json`);
    dictCache[lang] = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null;
  }
  return dictCache[lang];
}
const overrides = () => { const f = P("private/dict/overrides.json"); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {}; };
const missingWords = [];
function lessonDict(l, lang) {
  const base = dictFor(lang); if (!base) return null;
  const over = overrides()[l.id] || {};
  const out = {};
  for (const w of new Set(l.text.join(" ").toLowerCase().match(WORD_RE) || [])) {
    const e = over[w] || base[w];
    if (e) out[w] = e; else missingWords.push(`${l.id}: ${w}`);
  }
  return out;
}

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

// Short links:  verba-school.online/#<short>-xxxx-xxxx-xxxx
// The 12-letter code comes from the master secret (31 letters and digits, no 0/o/1/l/i look-alikes,
// about 59 bits) and is stretched with PBKDF2 into the AES key, so guessing stays out of reach.
// Must match shortCode()/shortAesKey() in admin.html and index.html.
export const CODE_ABC = "23456789abcdefghjkmnpqrstuvwxyz";
export const SHORT_ITER = 100000;
export async function shortCode(master, id, v) {
  let out = "", n = 0;
  while (out.length < 12) {
    for (const b of await hmac(master, enc(`short:${id}:${v}:${n++}`)))
      if (b < 248 && out.length < 12) out += CODE_ABC[b % 31];   // 248 = 31*8: no bias
  }
  return out;
}
export async function shortAesKey(short, code) {
  const base = await subtle.importKey("raw", enc(code), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await subtle.deriveBits({ name: "PBKDF2", salt: enc(`verba:${short}`), iterations: SHORT_ITER, hash: "SHA-256" }, base, 256));
}
export const groupCode = (c) => c.match(/.{4}/g).join("-");
// Old long links (#<id>~<key>) open a tiny file that points to the short one.
const redirectBytes = (short, code) => enc(JSON.stringify({ redirect: { s: short, k: code } }));
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

// usernames are matched without case; the file name is the lower-case form
export const slugify = (u) => String(u).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// ---------- online lessons (Jitsi as a Service, 8x8.vc) ----------
// private/jaas/config.json: { "appId": "vpaas-magic-cookie-…", "kid": "vpaas-magic-cookie-…/abc123" }
// private/jaas/jaas-private.pem: the private key whose public half is uploaded in the JaaS console.
// Each tutor gets a room; the student link (#live-<tutor>-xxxx-xxxx-xxxx) opens a guest pass for it,
// and the tutor panel signs the tutor's own moderator pass when a lesson starts.
const b64uStr = (u8) => Buffer.from(u8).toString("base64url");
export async function signJaas(pkcs8, kid, payload) {
  const key = await subtle.importKey("pkcs8", pkcs8, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const head = b64uStr(enc(JSON.stringify({ alg: "RS256", kid, typ: "JWT" }))) + "." + b64uStr(enc(JSON.stringify(payload)));
  return head + "." + b64uStr(new Uint8Array(await subtle.sign("RSASSA-PKCS1-v1_5", key, enc(head))));
}
export const studentPass = (appId, room, exp) => ({
  aud: "jitsi", iss: "chat", sub: appId, room, exp, nbf: 1700000000,
  context: { user: { id: `student-${room}`, name: "", avatar: "", email: "", moderator: "false" },
    features: { livestreaming: "false", recording: "false", transcription: "false", "outbound-call": "false" } },
});
function jaasConfig() {
  const cf = P("private/jaas/config.json"), kf = P("private/jaas/jaas-private.pem");
  if (!fs.existsSync(cf) || !fs.existsSync(kf)) return null;
  const c = JSON.parse(fs.readFileSync(cf, "utf8"));
  if (!/^vpaas-magic-cookie-[0-9a-f]+$/.test(c.appId || "") || !String(c.kid || "").startsWith(c.appId + "/"))
    throw new Error("private/jaas/config.json: appId must be vpaas-magic-cookie-… and kid must start with the appId and a slash.");
  const pem = fs.readFileSync(kf, "utf8");
  const der = Buffer.from(pem.replace(/-----[^-]+-----|\s+/g, ""), "base64");
  return { appId: c.appId, kid: c.kid, pkcs8: new Uint8Array(der), key: der.toString("base64") };
}

async function writeProfile(file, pw, salt, master, innerObj) {
  const inner = enc(JSON.stringify(innerObj));
  const k = await pwKey(pw, salt, ITER);
  const iv = (await hmac(master, inner)).slice(0, 12);   // deterministic: unchanged profile = unchanged file
  const ct = new Uint8Array(await subtle.encrypt({ name: "AES-GCM", iv }, k, inner));
  return writeIfChanged(file, enc(JSON.stringify({ v: 1, iter: ITER, salt: b64(salt), iv: b64(iv), ct: b64(ct) }, null, 1) + "\n"));
}

async function main() {
  // private/tutors.json: [{ "username": "Margarita", "password": "…", "language": "es" }, …]
  // Each tutor has their own master secret and owns the lessons and tests whose "owner" is
  // their username (lessons without an owner belong to the first tutor).
  const tutors = JSON.parse(fs.readFileSync(P("private/tutors.json"), "utf8"));
  if (!tutors.length) throw new Error("private/tutors.json has no tutors.");
  const lessons = JSON.parse(fs.readFileSync(P("private/lessons.json"), "utf8"));
  const testsFile = P("private/tests.json");
  const tests = fs.existsSync(testsFile) ? JSON.parse(fs.readFileSync(testsFile, "utf8")) : [];
  const firstSlug = slugify(tutors[0].username);
  const ownerOf = (x) => slugify(x.owner || firstSlug);
  for (const x of [...lessons, ...tests]) if (!tutors.some((t) => slugify(t.username) === ownerOf(x)))
    throw new Error(`${x.id}: owner "${x.owner}" is not in private/tutors.json`);

  const shorts = [...lessons, ...tests].map((x) => x.short);
  const dup = shorts.find((s, i) => shorts.indexOf(s) !== i);
  if (dup) throw new Error(`Two items share the short name "${dup}".`);

  const jaas = jaasConfig();
  // guest passes last until the end of next year, so a rebuild in the same year changes nothing
  const passExp = Math.floor(Date.UTC(new Date().getUTCFullYear() + 2, 0, 1) / 1000);

  const keep = new Set();
  let changed = 0, lessonsChanged = false, testsChanged = false;
  const report = [], links = [];

  for (const tu of tutors) {
    const slug = slugify(tu.username), pw = tu.password;
    if (!slug) throw new Error("A tutor has an empty username.");
    if (!pw || pw.length < 12) throw new Error(`${tu.username}: password must be at least 12 characters.`);
    const file = P("tutors", `${slug}.json`);
    // the first tutor inherits the old single admin.json, so links already sent keep working
    const src = fs.existsSync(file) ? file : (slug === firstSlug && fs.existsSync(P("admin.json")) ? P("admin.json") : null);
    let master, salt, gh = null, adminV = {}, liveV = 1;
    if (src) {
      let inner;
      try { inner = await openAdmin(JSON.parse(fs.readFileSync(src, "utf8")), pw); }
      catch { throw new Error(`Wrong password for ${tu.username} (${path.relative(ROOT, src)}).`); }
      master = unb64(inner.master); salt = unb64(JSON.parse(fs.readFileSync(src, "utf8")).salt);
      gh = inner.gh || null;                                   // GitHub key saved from the tutor panel
      for (const c of inner.lessons || []) adminV[c.id] = c.v; // link versions changed from the panel
      if (inner.live) liveV = inner.live.v || 1;
    } else {
      master = crypto.getRandomValues(new Uint8Array(32));
      salt = crypto.getRandomValues(new Uint8Array(16));
      console.log(`Created a new profile for ${tu.username}.`);
    }

    const catalog = [];
    for (const l of lessons.filter((x) => ownerOf(x) === slug)) {
      const v = Math.max(l.v || 1, adminV[l.id] || 1);
      if (v !== l.v) { l.v = v; lessonsChanged = true; }
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(l.short || "")) throw new Error(`${l.id}: needs a "short" name (a-z, 0-9, -)`);
      const longKey = await lessonKey(master, l.id, v);
      const code = await shortCode(master, l.id, v);
      const key = await shortAesKey(l.short, code);
      const sents = l.text.map(splitSentences);
      const count = sents.flat().length;
      let rec = null;
      const tj = P("private/audio", `${l.id}.json`), mp3 = P("private/audio", `${l.id}.mp3`);
      if (fs.existsSync(tj) && fs.existsSync(mp3)) {
        rec = JSON.parse(fs.readFileSync(tj, "utf8"));
        if (rec.starts.length !== count) throw new Error(`${l.id}: timings have ${rec.starts.length} sentences, text has ${count}. Re-run tools/align.py.`);
        if (writeIfChanged(P("a", `${l.short}.bin`), await seal(key, new Uint8Array(fs.readFileSync(mp3))))) changed++;
        keep.add(`a/${l.short}.bin`);
      }
      const lang = l.lang || tu.language || "es";
      const data = { id: l.id, lang, level: l.level, title: l.title, topic: l.topic, summary: l.summary,
        narrator: l.narrator, sents, gloss: l.gloss, q: l.q, rec, dict: lessonDict(l, lang) };
      if (writeIfChanged(P("c", `${l.short}.bin`), await seal(key, enc(JSON.stringify(data))))) changed++;
      keep.add(`c/${l.short}.bin`);
      if (writeIfChanged(P("content", `${l.id}.bin`), await seal(longKey, redirectBytes(l.short, code)))) changed++;
      keep.add(`content/${l.id}.bin`);
      catalog.push({ id: l.id, short: l.short, lang, v, level: l.level, title: l.title, topic: l.topic, narrator: l.narrator, audio: !!rec });
    }

    // level tests: options are written correct-first and shuffled here with a fixed seed per question
    for (const t of tests.filter((x) => ownerOf(x) === slug)) {
      const v = Math.max(t.v || 1, adminV[t.id] || 1);
      if (v !== t.v) { t.v = v; testsChanged = true; }
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.short || "")) throw new Error(`${t.id}: needs a "short" name (a-z, 0-9, -)`);
      const longKey = await lessonKey(master, t.id, v);
      const code = await shortCode(master, t.id, v);
      const key = await shortAesKey(t.short, code);
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
      const data = { id: t.id, kind: "test", lang: t.lang || tu.language || "es", level: t.level, title: t.title, topic: t.topic,
        pass: t.pass || 0.7, minutes: t.minutes || 20, sections };
      if (writeIfChanged(P("c", `${t.short}.bin`), await seal(key, enc(JSON.stringify(data))))) changed++;
      keep.add(`c/${t.short}.bin`);
      if (writeIfChanged(P("content", `${t.id}.bin`), await seal(longKey, redirectBytes(t.short, code)))) changed++;
      keep.add(`content/${t.id}.bin`);
      catalog.push({ id: t.id, short: t.short, lang: data.lang, v, kind: "test", level: t.level, title: t.title, topic: t.topic, questions: qn, pass: data.pass, audio: false });
    }

    let live = null;
    if (jaas) {
      const short = `live-${slug}`, id = `live:${slug}`;
      const code = await shortCode(master, id, liveV);
      const jwt = await signJaas(jaas.pkcs8, jaas.kid, studentPass(jaas.appId, slug, passExp));
      const data = { id, kind: "live", lang: tu.language || "es", tutor: tu.username, appId: jaas.appId, room: slug, jwt };
      if (writeIfChanged(P("c", `${short}.bin`), await seal(await shortAesKey(short, code), enc(JSON.stringify(data))))) changed++;
      keep.add(`c/${short}.bin`);
      live = { id, short, v: liveV, appId: jaas.appId, kid: jaas.kid, room: slug, key: jaas.key, exp: passExp };
      links.push(`${short}-${groupCode(code)}   (online lesson)`);
    }

    const innerObj = { username: tu.username, language: tu.language || null, master: b64(master), lessons: catalog, ...(live ? { live } : {}), ...(gh ? { gh } : {}) };
    if (await writeProfile(file, pw, salt, master, innerObj)) changed++;
    keep.add(`tutors/${slug}.json`);
    report.push(`${tu.username}: ${catalog.filter((c) => c.kind !== "test").length} listenings (${catalog.filter((c) => c.audio).length} recorded), ${catalog.filter((c) => c.kind === "test").length} tests`);
    for (const c of catalog) links.push(`${c.short}-${groupCode(await shortCode(master, c.id, c.v))}   (old: ${c.id}~${b64u(await lessonKey(master, c.id, c.v))})`);
  }

  if (lessonsChanged) fs.writeFileSync(P("private/lessons.json"), JSON.stringify(lessons, null, 1));
  if (testsChanged) fs.writeFileSync(testsFile, JSON.stringify(tests, null, 1));
  if (fs.existsSync(P("admin.json"))) { fs.unlinkSync(P("admin.json")); changed++; console.log("Moved admin.json into tutors/."); }

  // remove files for lessons, tests or tutors that no longer exist
  for (const dir of ["c", "a", "content", "audio", "tutors"]) {
    if (!fs.existsSync(P(dir))) continue;
    for (const f of fs.readdirSync(P(dir))) if (!keep.has(`${dir}/${f}`)) { fs.unlinkSync(P(dir, f)); changed++; }
  }

  // pages ask for style.css by its content hash, so a cached old stylesheet is never paired with a new page
  const cssHash = (await subtle.digest("SHA-256", fs.readFileSync(P("style.css")))).slice(0, 4);
  const ver = Buffer.from(cssHash).toString("hex");
  for (const page of ["index.html", "admin.html"]) {
    const html = fs.readFileSync(P(page), "utf8");
    const next = html.replace(/href="style\.css(\?v=[0-9a-f]*)?"/, `href="style.css?v=${ver}"`);
    if (next !== html) { fs.writeFileSync(P(page), next); changed++; }
  }

  // public pages: landing in four languages, SEO tags, sitemap, robots
  const { buildSite } = await import("./site.mjs");
  changed += buildSite(ROOT, ver);

  console.log(report.join("\n") + `\n${changed} files updated.`);
  if (missingWords.length) console.log(`Words without a translation (${missingWords.length}): ${missingWords.slice(0, 40).join(", ")}${missingWords.length > 40 ? " …" : ""}`);
  if (process.env.VERBA_PRINT_LINKS) for (const l of links) console.log(l);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
