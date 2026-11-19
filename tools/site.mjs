// Verba School public pages: fills tools/landing.html with tools/site-strings.json and writes
//   index.html (Armenian, between the landing/seo markers; the page also hosts the student player)
//   en/index.html, es/index.html, ru/index.html
//   sitemap.xml, robots.txt
// Called from tools/build.mjs; returns how many files changed.

import fs from "node:fs";
import path from "node:path";

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

function fill(tpl, S, root, current) {
  let html = tpl.replace(/(<(\w+)\b[^>]*\bdata-t="(\w+)"[^>]*>)(<\/\2>)/g, (m, open, tag, key, close) => {
    if (!(key in S)) throw new Error(`site-strings: missing "${key}"`);
    return open + S[key] + close;
  });
  const nav = `<nav class="langtabs" id="sitelangs" aria-label="Language">\n` + LANGS.map((l) =>
    `        <a href="/${l.dir}" hreflang="${l.code}" lang="${l.code}"${l.code === current ? ' class="on" aria-current="page"' : ""}>${l.label}</a>`
  ).join("\n") + `\n      </nav>`;
  return html.replace("{{LANGNAV}}", nav).replaceAll("{{ROOT}}", root);
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
    `<meta name="theme-color" content="#b62827">`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd(S, l.code))}</script>`,
  ].join("\n");
}

function pageShell(S, l, body, cssVer) {
  return `<!doctype html>
<html lang="${l.code}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>if(location.protocol==="http:"&&!/^(localhost|127\\.)/.test(location.hostname))location.replace("https:"+location.href.slice(5));</script>
${head(S, l)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Noto+Sans+Armenian:wght@400;600;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap">
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

export function buildSite(ROOT, cssVer) {
  const P = (...a) => path.join(ROOT, ...a);
  const strings = JSON.parse(fs.readFileSync(P("tools/site-strings.json"), "utf8"));
  const tpl = fs.readFileSync(P("tools/landing.html"), "utf8");
  let changed = 0;
  for (const l of LANGS) {
    const S = strings[l.code];
    const landing = fill(tpl, S, "/", l.code);
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
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map((l) => `  <url>
    <loc>${SITE + l.dir}</loc>
${LANGS.map((x) => `    <xhtml:link rel="alternate" hreflang="${x.code}" href="${SITE + x.dir}"/>`).join("\n")}
    <lastmod>${today}</lastmod>
  </url>`).join("\n")}
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
