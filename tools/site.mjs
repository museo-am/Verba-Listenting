// Verba School public pages: fills tools/landing.html with tools/site-strings.json and writes
//   index.html (Armenian, between the landing/seo markers; the page also hosts the student player)
//   en/index.html, es/index.html, ru/index.html
//   sitemap.xml, robots.txt
// Called from tools/build.mjs; returns how many files changed.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { allPages, resourceLinks } from "./pages.mjs";

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
<script>(function(){try{var m=localStorage.getItem("vs-theme");if(m==="light"||m==="dark")document.documentElement.dataset.theme=m}catch(e){}})()</script>
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
  const foot = R.items.map(([h, t]) => `<a href="${h}">${t}</a>`).join("\n        ");
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
  return html.replaceAll("{{FOOTRES}}", foot).replace("{{RESOURCES}}", res).replaceAll("{{JSVER}}", jsVer)
    .replace(/\{\{C_(\w\w)\}\}/g, (m, x) => R.course(x));
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

export function buildSite(ROOT, cssVer) {
  const P = (...a) => path.join(ROOT, ...a);
  const strings = JSON.parse(fs.readFileSync(P("tools/site-strings.json"), "utf8"));
  const tpl = fs.readFileSync(P("tools/landing.html"), "utf8");
  const jsVer = crypto.createHash("sha256").update(fs.readFileSync(P("site.js"))).digest("hex").slice(0, 8);
  let changed = 0;
  for (const l of LANGS) {
    const S = strings[l.code];
    const landing = extras(fill(tpl, S, "/", l.code), l.code, jsVer);
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
    const l = LANGS.find((x) => x.code === pg.ui);
    changed += write(P(pg.path, "index.html"), pageShell(S, l, html, cssVer, subHead(pg, alts, S)).replace('<body class="is-landing">', '<body class="is-landing is-sub">'));
    keepSub.add(pg.path);
  }

  const today = new Date().toISOString().slice(0, 10);
  const urlEntry = (loc, alts) => `  <url>
    <loc>${SITE + loc}</loc>
${Object.entries(alts).map(([l, p]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE + p}"/>`).join("\n")}
    <lastmod>${today}</lastmod>
  </url>`;
  const homeAlts = Object.fromEntries(LANGS.map((l) => [l.code, l.dir]));
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map((l) => urlEntry(l.dir, homeAlts)).join("\n")}
${pages.map((pg) => urlEntry(pg.path, groups[pg.group])).join("\n")}
</urlset>
`;
  // keep lastmod stable unless the pages changed
  const old = fs.existsSync(P("sitemap.xml")) ? fs.readFileSync(P("sitemap.xml"), "utf8") : "";
  if (changed || !old) changed += write(P("sitemap.xml"), sitemap);
  changed += write(P("robots.txt"), `User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /tutors/
Disallow: /c/
Disallow: /a/
Disallow: /content/
Disallow: /audio/
Disallow: /tools/

Sitemap: ${SITE}sitemap.xml
`);
  return changed;
}
