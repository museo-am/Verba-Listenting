// Verba School public pages: fills tools/landing.html with tools/site-strings.json and writes
//   index.html (Armenian, between the landing/seo markers; the page also hosts the student player)
//   en/index.html, es/index.html, ru/index.html
//   sitemap.xml, robots.txt
// Called from tools/build.mjs; returns how many files changed.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { allPages, resourceLinks } from "./pages.mjs";
import { FAQ, FAQ_T } from "./content/faq.mjs";
import { UI_LANGS, HOME, COURSE, TEST, BLOG, ARTICLE, REFERRAL } from "./content/routes.mjs";
import { ARTICLES } from "./content/articles.mjs";

const SITE = "https://verba-school.online/";
const LANGS = [
  { code: "hy", dir: "", label: "ՀՅ" },
  { code: "en", dir: "en/", label: "EN" },
  { code: "es", dir: "es/", label: "ES" },
  { code: "ru", dir: "ru/", label: "RU" },
];
const IG = "https://www.instagram.com/verba.school_/";
const PHONE = "+37477308525";

const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const plain = (s) => String(s).replace(/<[^>]+>/g, "");

function fill(tpl, S, root, current, hrefs = {}) {
  let html = tpl.replace(/(<(\w+)\b[^>]*\bdata-t="(\w+)"[^>]*>)(<\/\2>)/g, (m, open, tag, key, close) => {
    if (!(key in S)) throw new Error(`site-strings: missing "${key}"`);
    return open + S[key] + close;
  });
  const nav = `<nav class="langtabs" id="sitelangs" aria-label="Language">\n` + LANGS.map((l) =>
    `        <a href="${hrefs[l.code] || "/" + l.dir}" hreflang="${l.code}" lang="${l.code}"${l.code === current ? ' class="on" aria-current="page"' : ""}>${l.label}</a>`
  ).join("\n") + `\n      </nav>`;
  const links = `<nav class="langlinks" aria-label="Language">` + LANGS.map((l) =>
    `<a href="${hrefs[l.code] || "/" + l.dir}" hreflang="${l.code}" lang="${l.code}"${l.code === current ? ' class="on" aria-current="page"' : ""}>${l.label}</a>`).join("") + `</nav>`;
  return html.replace("{{LANGNAV}}", nav).replaceAll("{{LANGLINKS}}", links).replaceAll("{{ROOT}}", root);
}

// home-page FAQ: links point to the page language's test and bring-a-friend pages (Spanish → English pages)
function faqItems(lang, abs = false) {
  const ui = UI_LANGS.includes(lang) ? lang : "en", pre = abs ? SITE : "/";
  return FAQ[lang].map(([q, a]) => [q, a.replaceAll("{{TEST}}", pre + TEST.en[ui]).replaceAll("{{REF}}", pre + REFERRAL[ui])]);
}
function faqSection(lang) {
  return `<section class="lsec" id="faq">
    <div class="lsec-in">
      <div class="shead rv"><h2>${FAQ_T[lang]}</h2></div>
      <div class="faq rv">${faqItems(lang).map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
    </div>
  </section>`;
}

function jsonLd(S, lang) {
  const school = SITE + "#school";
  const course = (code, name) => ({
    "@type": "Course",
    "@id": `${SITE}#course-${code}`,
    name: `${name} — Verba School`,
    description: plain(S[{ es: "lEsText", en: "lEnText", fr: "lFrText" }[code]]),
    inLanguage: code,
    educationalLevel: "A1–C1 (CEFR)",
    provider: { "@id": school },
    hasCourseInstance: [{ "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT1H" }],
    offers: [
      { "@type": "Offer", category: "Group", price: 25000, priceCurrency: "AMD", url: SITE },
      { "@type": "Offer", category: "Private", price: 30000, priceCurrency: "AMD", url: SITE },
    ],
  });
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": school,
        name: "Verba School",
        alternateName: ["Verba", "Verba School Armenia", "Վերբա"],
        url: SITE,
        logo: SITE + "img/logo.png",
        image: SITE + "img/og.png",
        description: S.metaDesc,
        telephone: PHONE,
        sameAs: [IG],
        areaServed: { "@type": "Country", name: "Armenia" },
        knowsLanguage: ["es", "en", "fr", "hy"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: plain(S.pricesTitle),
          itemListElement: [
            { "@type": "Offer", name: plain(S.groupT), description: plain(S.groupD), price: 25000, priceCurrency: "AMD",
              priceSpecification: { "@type": "UnitPriceSpecification", price: 25000, priceCurrency: "AMD", unitText: "MONTH" } },
            { "@type": "Offer", name: plain(S.privT), description: plain(S.privD), price: 30000, priceCurrency: "AMD",
              priceSpecification: { "@type": "UnitPriceSpecification", price: 30000, priceCurrency: "AMD", unitText: "MONTH" } },
          ],
        },
      },
      { "@type": "WebSite", "@id": SITE + "#website", name: "Verba School", alternateName: "Verba", url: SITE, inLanguage: lang, publisher: { "@id": school } },
      course("es", plain(S.lEs)), course("en", plain(S.lEn)), course("fr", plain(S.lFr)),
      { "@type": "FAQPage", "@id": SITE + (LANGS.find((l) => l.code === lang) || LANGS[0]).dir + "#faq", inLanguage: lang,
        mainEntity: faqItems(lang, true).map(([q, a]) => ({ "@type": "Question", name: plain(q), acceptedAnswer: { "@type": "Answer", text: plain(a) } })) },
    ],
  };
}

function head(S, l) {
  const url = SITE + l.dir;
  const alts = LANGS.map((x) => `<link rel="alternate" hreflang="${x.code}" href="${SITE + x.dir}">`).join("\n")
    + `\n<link rel="alternate" hreflang="x-default" href="${SITE}">`;
  return [
    `<title>${S.title}</title>`,
    `<meta name="description" content="${escAttr(S.metaDesc)}">`,
    `<link rel="canonical" href="${url}">`,
    alts,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Verba School">`,
    `<meta property="og:title" content="${escAttr(S.title)}">`,
    `<meta property="og:description" content="${escAttr(S.metaDesc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${SITE}img/og.png">`,
    `<meta property="og:locale" content="${S.ogLocale}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<link rel="icon" type="image/png" sizes="32x32" href="/img/icon-32.png">`,
    `<link rel="apple-touch-icon" href="/img/icon-180.png">`,
    `<meta name="theme-color" content="#141110">`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd(S, l.code))}</script>`,
  ].join("\n");
}

function pageShell(S, l, body, cssVer, headHtml) {
  return `<!doctype html>
<html lang="${l.code}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>if(location.protocol==="http:"&&!/^(localhost|127\\.)/.test(location.hostname))location.replace("https:"+location.href.slice(5));</script>
<script>(function(){try{var m=localStorage.getItem("vs-theme");if(m==="light"||m==="dark")document.documentElement.dataset.theme=m;if(localStorage.getItem("vs-refbar")==="0")document.documentElement.classList.add("norefbar")}catch(e){}})()</script>
${headHtml || head(S, l)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Armenian:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,500;1,600&family=JetBrains+Mono:wght@500;700&display=swap">
<link rel="stylesheet" href="/style.css?v=${cssVer}">
</head>
<body class="is-landing">
${body}</body>
</html>
`;
}

function write(file, text) {
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === text) return 0;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  return 1;
}

function extras(html, lang, jsVer) {
  const R = resourceLinks(lang);
  const foot = [...R.items, [R.ref, R.refLabel]].map(([h, t]) => `<a href="${h}">${t}</a>`).join("\n        ");
  const RT = { hy: ["Անվճար", "Սկսեք հիմա՝ առանց գրանցվելու", "Անվճար թեստ՝ իմացեք ձեր մակարդակը", "20 հարց՝ A1-ից մինչև C1, մոտ 10 րոպե։", "Կարդացեք նաև"],
    ru: ["Бесплатно", "Начните прямо сейчас, без регистрации", "Бесплатный тест: узнайте свой уровень", "20 вопросов от A1 до C1, около 10 минут.", "Читайте также"],
    en: ["Free", "Start now, no sign-up needed", "Free test: find your level", "20 questions from A1 to C1, about 10 minutes.", "Read also"] }[R.ui];
  const TN = { hy: ["Իսպաներեն", "Անգլերեն", "Ֆրանսերեն"], ru: ["Испанский", "Английский", "Французский"], en: ["Spanish", "English", "French"] }[R.ui];
  const res = `<section class="lsec" id="recursos">
    <div class="lsec-in">
      <div class="shead rv"><p class="eyebrow">${RT[0]}</p><h2>${RT[1]}</h2></div>
      <div class="resgrid">
        <article class="rescard test rv"><h3>${RT[2]}</h3><p>${RT[3]}</p><div class="reslinks">${["es", "en", "fr"].map((x, i) => `<a class="btn ghost" href="${R.test(x)}">${TN[i]}</a>`).join("")}</div></article>
        <article class="rescard rv"><h3>${RT[4]}</h3><ul>${R.articles.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul><a class="resmore" href="${R.blog}">${R.items[4][1]} →</a></article>
      </div>
    </div>
  </section>`;
  const CL = { hy: "Դասընթացներ", ru: "Курсы", en: "Courses" }[R.ui];
  html = html.replaceAll("{{CL_T}}", lang === "es" ? "Cursos" : CL).replaceAll("{{CL_es}}", R.items[0][1]).replaceAll("{{CL_en}}", R.items[1][1]).replaceAll("{{CL_fr}}", R.items[2][1]);
  return html.replaceAll("{{L_REF}}", R.ref).replaceAll("{{REF_LABEL}}", R.refLabel).replaceAll("{{L_BLOG}}", R.blog).replaceAll("{{FOOTRES}}", foot).replace("{{RESOURCES}}", res).replaceAll("{{JSVER}}", jsVer)
    .replaceAll(/\{\{C_(\w\w)\}\}/g, (m, x) => R.course(x));
}

function crumbsHtml(crumbs) {
  return `<nav class="crumbs lsec-in" aria-label="Breadcrumb"><ol>${crumbs.map(([t, h]) => `<li>${h ? `<a href="${h}">${t}</a>` : `<span aria-current="page">${t}</span>`}</li>`).join("")}</ol></nav>`;
}

function subHead(pg, alts, S) {
  const url = SITE + pg.path;
  const graph = jsonLd(S, pg.ui)["@graph"][0];   // the school itself
  const crumbList = { "@type": "BreadcrumbList", itemListElement: pg.crumbs.map(([t, h], i) => ({ "@type": "ListItem", position: i + 1, name: plain(t), item: h ? SITE + h.replace(/^\//, "") : url })) };
  return [
    `<title>${pg.title}</title>`,
    `<meta name="description" content="${escAttr(pg.metaDesc)}">`,
    `<link rel="canonical" href="${url}">`,
    ...Object.entries(alts).map(([l, p]) => `<link rel="alternate" hreflang="${l}" href="${SITE + p}">`),
    alts.hy ? `<link rel="alternate" hreflang="x-default" href="${SITE + alts.hy}">` : "",
    `<meta property="og:type" content="${pg.group.startsWith("art-") ? "article" : "website"}">`,
    `<meta property="og:site_name" content="Verba School">`,
    `<meta property="og:title" content="${escAttr(pg.title)}">`,
    `<meta property="og:description" content="${escAttr(pg.metaDesc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${SITE}img/og.png">`,
    `<meta property="og:locale" content="${S.ogLocale}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<link rel="icon" type="image/png" sizes="32x32" href="/img/icon-32.png">`,
    `<link rel="apple-touch-icon" href="/img/icon-180.png">`,
    `<meta name="theme-color" content="#141110">`,
    `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [graph, ...pg.jsonld, crumbList] })}</script>`,
  ].filter(Boolean).join("\n");
}

// /llms.txt: a plain-markdown summary for AI assistants (llmstxt.org), in English with the Armenian and Russian pages linked
function llmsTxt() {
  const u = (p) => SITE + p, name = { es: "Spanish", en: "English", fr: "French" };
  const qa = faqItems("en", true).map(([q, a]) => `### ${q}\n${plain(a.replace(/<a href="([^"]+)">([^<]+)<\/a>/g, "[$2]($1)"))}`).join("\n\n");
  return `# Verba School

> Online language school in Armenia (verba-school.online). Spanish, English and French lessons from A1 to C1 (CEFR), taught with explanations in Armenian. Lessons are online, in a group or one-on-one. Group lessons 25,000 AMD/month, private lessons 30,000 AMD/month. Certificate at the end of the course. Contact: Instagram @verba.school_, phone +374 77 30 85 25.

Verba School (Armenian: Վերբա) explains grammar in Armenian and builds listening and speaking with real texts. Lessons follow the European language levels (CEFR); at the end of each level a test shows whether the student is ready for the next one.
All lessons are online, in a group or one-on-one. Students get personal links to listening tasks, level tests and online lessons.
The website is in Armenian (main), Russian and English, with a Spanish home page.

## Courses
${["es", "en", "fr"].map((x) => `- [${name[x]} lessons online](${u(COURSE[x].en)}): ${name[x]} from beginner to advanced. Armenian: ${u(COURSE[x].hy)} · Russian: ${u(COURSE[x].ru)}`).join("\n")}

## Free level tests
${["es", "en", "fr"].map((x) => `- [Free ${name[x]} level test](${u(TEST[x].en)}): 20 questions, about 10 minutes, result from A1 to C1.`).join("\n")}

## Prices and offers
- Group lessons: 25,000 AMD per month.
- Private (one-to-one) lessons: 30,000 AMD per month.
- [Bring a friend](${u(REFERRAL.en)}): the friend gets 10% off their first month, the student who invited them gets 5,000 AMD.

## Frequently asked questions
${qa}

## Articles
${Object.keys(ARTICLE).map((k) => `- [${plain(ARTICLES[k].en.title)}](${u(ARTICLE[k].en)}): ${plain(ARTICLES[k].en.lede)}`).join("\n")}
- [Blog](${u(BLOG.en)})

## Contact
- Instagram: https://www.instagram.com/verba.school_/ (@verba.school_)
- Phone: +374 77 30 85 25
- Website: ${SITE} (Armenian), ${SITE}ru/ (Russian), ${SITE}en/ (English), ${SITE}es/ (Spanish)
`;
}

export function buildSite(ROOT, cssVer) {
  const P = (...a) => path.join(ROOT, ...a);
  const strings = JSON.parse(fs.readFileSync(P("tools/site-strings.json"), "utf8"));
  const tpl = fs.readFileSync(P("tools/landing.html"), "utf8");
  const jsVer = crypto.createHash("sha256").update(fs.readFileSync(P("site.js"))).digest("hex").slice(0, 8);
  let changed = 0;
  for (const l of LANGS) {
    const S = strings[l.code];
    const landing = extras(fill(tpl, S, "/", l.code), l.code, jsVer).replace("{{FAQ}}", faqSection(l.code));
    if (l.code === "hy") {
      let html = fs.readFileSync(P("index.html"), "utf8");
      html = html.replace(/<!--landing:start-->[\s\S]*?<!--landing:end-->/, `<!--landing:start-->\n${landing}<!--landing:end-->`)
                 .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n${head(S, l)}\n<!--seo:end-->`)
                 .replace(/<title>[^<]*<\/title>\n(?=<!--seo:start-->)/, "");
      changed += write(P("index.html"), html);
    } else {
      changed += write(P(l.dir, "index.html"), pageShell(S, l, landing, cssVer));
    }
  }
  // course pages, free tests, blog
  const pages = allPages(), ptpl = fs.readFileSync(P("tools/page.html"), "utf8");
  const groups = {};
  for (const pg of pages) (groups[pg.group] ||= {})[pg.ui] = pg.path;
  const keepSub = new Set();
  for (const pg of pages) {
    const S = strings[pg.ui], alts = groups[pg.group];
    const hrefs = Object.fromEntries(LANGS.map((l) => [l.code, alts[l.code] ? "/" + alts[l.code] : "/" + l.dir]));
    let html = extras(fill(ptpl, S, "/", pg.ui, hrefs), pg.ui, jsVer)
      .replaceAll("{{HOME}}", "/" + (LANGS.find((l) => l.code === pg.ui).dir))
      .replace("{{CRUMBS}}", crumbsHtml(pg.crumbs)).replace("{{BODY}}", pg.body);
    if (pg.group === "referral") html = html.replace(/<!--refbar-->[\s\S]*?<!--\/refbar-->\n?/, "");
    const l = LANGS.find((x) => x.code === pg.ui);
    changed += write(P(pg.path, "index.html"), pageShell(S, l, html, cssVer, subHead(pg, alts, S)).replace('<body class="is-landing">', '<body class="is-landing is-sub">'));
    keepSub.add(pg.path);
  }

  // 404 page (GitHub Pages serves /404.html for any missing path): Armenian shell, short note in all three
  // languages and links back to the main pages; noindex and no canonical so it never competes with real pages
  {
    const S = strings.hy, l = LANGS[0], ui = ["hy", "ru", "en"];
    const T = { hy: ["Էջը չի գտնվել", "Հնարավոր է՝ հղումը սխալ է կամ էջը տեղափոխվել է։", "Գլխավոր էջ", "Անվճար թեստ"],
      ru: ["Страница не найдена", "Возможно, ссылка неверна или страница переехала.", "Главная", "Бесплатный тест"],
      en: ["Page not found", "The link may be wrong, or the page has moved.", "Home", "Free level test"] };
    const blocks = ui.map((x) => `<div class="nf-l" lang="${x}"><h${x === "hy" ? 1 : 2}>${T[x][0]}</h${x === "hy" ? 1 : 2}><p class="lede">${T[x][1]}</p>
        <p class="hero-cta"><a class="btn big" href="${HOME[x] || "/"}">${T[x][2]}</a><a class="btn big ghost" href="/${TEST.en[x]}">${T[x][3]}</a></p></div>`).join("\n      ");
    const body = `<section class="sub-hero small nf"><div class="lsec-in">
      <p class="eyebrow">404</p>
      ${blocks}
      <p class="hint">${["es", "en", "fr"].map((x) => `<a href="/${COURSE[x].hy}">${plain(S["l" + x[0].toUpperCase() + x[1]])}</a>`).join(" · ")} · <a href="/${BLOG.hy}">Բլոգ</a></p>
    </div></section>`;
    let html = extras(fill(ptpl, S, "/", "hy"), "hy", jsVer).replaceAll("{{HOME}}", "/").replace("{{CRUMBS}}", "").replace("{{BODY}}", body)
      .replace(/<!--refbar-->[\s\S]*?<!--\/refbar-->\n?/, "");
    const head404 = [`<title>404 · Verba School</title>`, `<meta name="robots" content="noindex">`,
      `<link rel="icon" type="image/png" sizes="32x32" href="/img/icon-32.png">`, `<meta name="theme-color" content="#141110">`].join("\n");
    changed += write(P("404.html"), pageShell(S, l, html, cssVer, head404).replace('<body class="is-landing">', '<body class="is-landing is-sub">'));
  }

  // lastmod per page: a fingerprint of the page's visible text (scripts, styles, tags and cache-busting
  // versions ignored) is kept in tools/lastmod.json; the date moves only when that page's content changes.
  // A page seen for the first time takes the date of its last git commit (today if it has uncommitted changes).
  const today = new Date().toISOString().slice(0, 10);
  const lmFile = P("tools/lastmod.json");
  const lm = fs.existsSync(lmFile) ? JSON.parse(fs.readFileSync(lmFile, "utf8")) : {};
  const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 }).trim();
  const fingerprint = (html) => {
    html = html.replace(/<!--landing:end-->[\s\S]*$/, "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ");
    const text = (html.match(/<!--landing:start-->([\s\S]*)/) || [, html])[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return crypto.createHash("sha256").update(text).digest("hex").slice(0, 16);
  };
  // first sighting: same text as the last commit → that commit's date, otherwise today
  const firstDate = (f, h) => { try { return fingerprint(git("show", "HEAD:" + f)) === h ? (git("log", "-1", "--format=%cs", "--", f) || today) : today; } catch (e) { return today; } };
  const lastmod = (loc) => {
    const f = path.join(loc, "index.html"), h = fingerprint(fs.readFileSync(P(f), "utf8"));
    if (!lm[loc] || lm[loc].hash !== h) lm[loc] = { hash: h, date: lm[loc] ? today : firstDate(f, h) };
    return lm[loc].date;
  };
  const urlEntry = (loc, alts) => `  <url>
    <loc>${SITE + loc}</loc>
${Object.entries(alts).map(([l, p]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE + p}"/>`).join("\n")}
    <lastmod>${lastmod(loc)}</lastmod>
  </url>`;
  const homeAlts = Object.fromEntries(LANGS.map((l) => [l.code, l.dir]));
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map((l) => urlEntry(l.dir, homeAlts)).join("\n")}
${pages.map((pg) => urlEntry(pg.path, groups[pg.group])).join("\n")}
</urlset>
`;
  changed += write(P("sitemap.xml"), sitemap);
  changed += write(lmFile, JSON.stringify(Object.fromEntries(Object.entries(lm).sort()), null, 1) + "\n");
  changed += write(P("llms.txt"), llmsTxt());
  // Search and AI-answer crawlers are named explicitly; model-training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot…)
  // are deliberately not named, so they only get the general rules: whether to block them is the school's decision.
  const rules = `Allow: /
Disallow: /admin.html
Disallow: /tutors/
Disallow: /c/
Disallow: /a/
Disallow: /content/
Disallow: /audio/
Disallow: /tools/`;
  changed += write(P("robots.txt"), `# Verba School. Public pages are open to search engines and AI search/answer crawlers.
# Private lesson data (encrypted lessons, audio, tutor files) and the tutor panel are not for crawling.
# A plain-text summary of the school: ${SITE}llms.txt

User-agent: Googlebot
User-agent: Bingbot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Applebot
User-agent: YandexBot
${rules}

User-agent: *
${rules}

Sitemap: ${SITE}sitemap.xml
`);
  return changed;
}
