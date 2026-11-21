/** @OnlyCurrentDoc */
/**
 * Verba School "Bring a friend" backend (Google Apps Script, bound to the "Verba referrals" sheet).
 * The website posts the two forms here; rows go to the sheet and a Telegram alert goes to the school.
 *
 * Setup (once):
 *  1. Project Settings → Script properties → add TG_TOKEN = the bot key from @BotFather.
 *  2. Send /start to the bot in Telegram, then in the sheet: menu Verba → Connect Telegram.
 *  3. Deploy → Web app, execute as Me, access Anyone. The /exec link goes into tools/content/referral.mjs.
 * The bot key lives only in Script properties, never in the website code.
 */
const CODES = "Codes", INVITES = "Invites";

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Verba")
    .addItem("Connect Telegram", "connectTelegram")
    .addItem("Send test alert", "testAlert")
    .addToUi();
}

function doGet() { return json({ ok: true, service: "verba-referrals" }); }

function doPost(e) {
  let d;
  try { d = JSON.parse((e && e.postData && e.postData.contents) || "{}"); } catch (err) { return json({ ok: false, error: "bad" }); }
  if (d.website) return json({ ok: true, code: "VERBA-00" });           // honeypot: bots fill the hidden field
  const lock = LockService.getScriptLock();
  try { lock.waitLock(10000); } catch (err) { return json({ ok: false, error: "busy" }); }
  try {
    if (d.action === "code") return json(makeCode(d));
    if (d.action === "invite") return json(addInvite(d));
    return json({ ok: false, error: "bad" });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: "server" });
  } finally { lock.releaseLock(); }
}

// ---------- actions ----------
function makeCode(d) {
  const name = clean(d.name, 40), phone = clean(d.phone, 20), lang = clean(d.lang, 2);
  if (!name) return { ok: false, error: "name" };
  if (!validPhone(phone)) return { ok: false, error: "phone" };
  const sh = sheet(CODES, ["Date", "Code", "Name", "Phone", "Lang", "Friends joined", "Rewards paid", "Notes"]);
  const rows = sh.getDataRange().getValues().slice(1), key = digits(phone);
  const mine = rows.find((r) => digits(r[3]) === key);
  if (mine) return { ok: true, code: String(mine[1]), existing: true };   // one code per phone number
  const taken = new Set(rows.map((r) => String(r[1]).toUpperCase()));
  const base = latin(name).slice(0, 6) || "VERBA";
  let code = "";
  for (let i = 0; i < 200 && (!code || taken.has(code)); i++) code = base + "-" + (i < 80 ? rnd(10, 99) : rnd(100, 999));
  sh.appendRow([new Date(), code, safe(name), safe(phone), lang, 0, 0, ""]);
  notify(`🎟 <b>New referral code</b>\n${esc(name)} · ${esc(phone)}\nCode: <code>${code}</code>`);
  return { ok: true, code };
}

function addInvite(d) {
  const name = clean(d.name, 40), phone = clean(d.phone, 20), code = clean(d.code, 12).toUpperCase(), lang = clean(d.lang, 2);
  if (!name) return { ok: false, error: "name" };
  if (!validPhone(phone)) return { ok: false, error: "phone" };
  if (!code) return { ok: false, error: "code" };
  const cs = sheet(CODES, ["Date", "Code", "Name", "Phone", "Lang", "Friends joined", "Rewards paid", "Notes"]);
  const codes = cs.getDataRange().getValues();
  const i = codes.findIndex((r, k) => k > 0 && String(r[1]).toUpperCase() === code);
  if (i < 0) return { ok: false, error: "nocode" };
  const ref = codes[i];
  if (digits(ref[3]) === digits(phone)) return { ok: false, error: "self" };
  const is = sheet(INVITES, ["Date", "Name", "Phone", "Code", "Invited by", "Inviter phone", "Lang", "Status", "Notes"]);
  const inv = is.getDataRange().getValues().slice(1);
  if (inv.some((r) => digits(r[2]) === digits(phone))) return { ok: false, error: "dup" };
  is.appendRow([new Date(), safe(name), safe(phone), code, safe(String(ref[2])), safe(String(ref[3])), lang, "New", ""]);
  cs.getRange(i + 1, 6).setValue((Number(ref[5]) || 0) + 1);
  notify(`🆕 <b>New student with a promo code (−10%)</b>\n${esc(name)} · ${esc(phone)}\nCode <code>${code}</code> from ${esc(ref[2])} · ${esc(ref[3])}`);
  return { ok: true };
}

// ---------- Telegram ----------
function connectTelegram() {
  const p = PropertiesService.getScriptProperties(), token = p.getProperty("TG_TOKEN"), ui = SpreadsheetApp.getUi();
  if (!token) return ui.alert("Add TG_TOKEN in Extensions → Apps Script → Project Settings → Script properties first.");
  const r = JSON.parse(UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/getUpdates`, { muteHttpExceptions: true }).getContentText());
  const msgs = (r.result || []).map((u) => u.message || u.my_chat_member).filter(Boolean);
  if (!msgs.length) return ui.alert("No messages yet. Open your bot in Telegram, press Start (or send any message), then try again.");
  const chat = msgs[msgs.length - 1].chat;
  p.setProperty("TG_CHAT", String(chat.id));
  notify("✅ Verba School referral alerts are connected.");
  ui.alert(`Connected to ${chat.first_name || chat.title || chat.id}. You should have a message from the bot now.`);
}
function testAlert() { notify("🔔 Test alert from the Verba referrals sheet."); }

function notify(text) {
  const p = PropertiesService.getScriptProperties(), token = p.getProperty("TG_TOKEN"), chat = p.getProperty("TG_CHAT");
  if (!token || !chat) return;
  try {
    UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "post", muteHttpExceptions: true,
      payload: { chat_id: chat, text: text + "\n\n" + SpreadsheetApp.getActive().getUrl(), parse_mode: "HTML", disable_web_page_preview: "true" } });
  } catch (err) { console.error(err); }
}

// ---------- helpers ----------
function sheet(name, head) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(head); sh.setFrozenRows(1); sh.getRange(1, 1, 1, head.length).setFontWeight("bold"); }
  return sh;
}
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clean(s, n) { return String(s == null ? "" : s).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n); }
function safe(s) { return /^[=+\-@]/.test(s) ? "'" + s : s; }       // keep the sheet from reading input as a formula
function digits(s) { return String(s).replace(/\D/g, "").replace(/^0+/, "").slice(-8); }
function validPhone(p) { const n = String(p).replace(/\D/g, "").length; return n >= 8 && n <= 15 && !/[^\d\s()+-]/.test(p); }
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/^'/, ""); }
function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function latin(s) {
  const M = { "ա":"a","բ":"b","գ":"g","դ":"d","ե":"e","զ":"z","է":"e","ը":"y","թ":"t","ժ":"zh","ի":"i","լ":"l","խ":"kh","ծ":"ts","կ":"k","հ":"h","ձ":"dz","ղ":"gh","ճ":"ch","մ":"m","յ":"y","ն":"n","շ":"sh","ո":"o","չ":"ch","պ":"p","ջ":"j","ռ":"r","ս":"s","վ":"v","տ":"t","ր":"r","ց":"ts","ւ":"v","փ":"p","ք":"k","օ":"o","ֆ":"f","և":"ev",
    "а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"e","ж":"zh","з":"z","и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"sh","ы":"y","э":"e","ю":"yu","я":"ya" };
  s = String(s).trim().split(/\s+/)[0].toLowerCase().replace(/ու/g, "u");
  let o = ""; for (const c of s) o += M[c] != null ? M[c] : (/[a-z]/.test(c) ? c : "");
  return o.toUpperCase();
}
