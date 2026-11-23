// Course pages, free placement tests, the blog and its articles, in Armenian, Russian and English.
// Called from tools/site.mjs. Every page is static HTML (good for search engines); site.js adds the
// menu, theme switch, listening demo and the placement-test scoring.
import fs from "node:fs";
import path from "node:path";
import { UI_LANGS, HOME, COURSE, TEST, BLOG, ARTICLE, REFERRAL } from "./content/routes.mjs";
import { REF_T, referralBody } from "./content/referral.mjs";
import { coursePage, NAMES } from "./content/course.mjs";
import { PLACEMENT, PT } from "./content/placement.mjs";
import { ARTICLES, BLOG_T } from "./content/articles.mjs";

export const SITE = "https://verba-school.online/";
const TARGETS = ["es", "en", "fr"];
const plain = (s) => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// small seeded shuffle so the options of the free tests stay in the same order between builds
function seeded(str) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }
function order(seed, n) { const r = seeded(seed), a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

const CRUMB_HOME = { hy: "Գլխավոր", ru: "Главная", en: "Home" };
const TESTS_WORD = { hy: "Անվճար թեստեր", ru: "Бесплатные тесты", en: "Free tests" };

function placementBody(target, ui) {
  const t = PT[ui], n = NAMES[ui][target], qs = PLACEMENT[target];
  const lv = ["A1", "A1", "A1", "A1", "A2", "A2", "A2", "A2", "B1", "B1", "B1", "B1", "B2", "B2", "B2", "B2", "C1", "C1", "C1", "C1"];
  const qhtml = qs.map(([p, opts], qi) => {
    const o = order(`${target}:${qi}`, opts.length);
    return `<fieldset class="pq" data-lv="${lv[qi]}"><legend><small>${qi + 1}</small> ${p.replace("___", "<span class=\"gap\">_____</span>")}</legend>
        <div class="pq-opts">${o.map((k, i) => `<label class="opt"><input type="radio" name="q${qi}" value="${k === 0 ? 1 : 0}"><i>${"abcd"[i]}</i><span lang="${target}">${opts[k]}</span></label>`).join("")}</div></fieldset>`;
  }).join("\n      ");
  const others = TARGETS.filter((x) => x !== target).map((x) => `<a href="/${TEST[x][ui]}">${PT[ui].h1(NAMES[ui][x])}</a>`).join("");
  return `
  <section class="sub-hero small">
    <div class="lsec-in">
      <p class="eyebrow chipline"><span class="pulse" aria-hidden="true"></span><span>A1 → C1 · 20 · ~10 min</span></p>
      <h1>${t.h1(n)}</h1>
      <p class="lede">${t.lede}</p>
    </div>
  </section>
  <section class="lsec tight">
    <div class="lsec-in">
      <form class="ptest" id="ptest" lang="${ui}" novalidate
        data-missing="${escAttr(t.missing("{k}"))}" data-score="${escAttr(t.score("{a}", "{b}"))}"
        data-desc='${escAttr(JSON.stringify(t.desc))}'>
      ${qhtml}
        <div class="pfoot"><button class="btn big" type="submit">${t.finish}</button><p class="pmsg" role="status"></p></div>
      </form>
      <section class="presult" id="presult" hidden aria-live="polite">
        <p class="eyebrow">${t.result}</p>
        <p class="plevel"><b id="plevel">B1</b><span id="pscore"></span></p>
        <div class="pbar" aria-hidden="true"><i id="pbar"></i><span>A1</span><span>A2</span><span>B1</span><span>B2</span><span>C1</span></div>
        <p class="pdesc2" id="pdesc"></p>
        <p class="hint">${t.note} ${t.review}</p>
        <div class="hero-cta"><a class="btn big" href="https://www.instagram.com/verba.school_/" target="_blank" rel="noopener">${t.cta}</a>
          <a class="btn big ghost" href="/${COURSE[target][ui]}">${t.course(n)}</a>
          <button class="btn big ghost" type="button" id="pagain">${t.again}</button></div>
      </section>
      <nav class="more"><h2>${t.other}</h2><ul>${TARGETS.filter((x) => x !== target).map((x) => `<li><a href="/${TEST[x][ui]}">${PT[ui].h1(NAMES[ui][x])}</a></li>`).join("")}</ul></nav>
    </div>
  </section>`;
}

function fillLinks(html, ui) {
  return html
    .replaceAll("{{PLATFORM}}", `${HOME[ui]}#plataforma`)
    .replaceAll("{{LEVELS}}", "/" + ARTICLE.levels[ui]).replaceAll("{{HOWLONG}}", "/" + ARTICLE.howlong[ui])
    .replaceAll("{{ESFR}}", "/" + ARTICLE.esfr[ui]).replaceAll("{{POLYGLOT}}", "/" + ARTICLE.polyglot[ui])
    .replace(/\{\{TEST_(\w\w)\}\}/g, (m, x) => "/" + TEST[x][ui]).replace(/\{\{COURSE_(\w\w)\}\}/g, (m, x) => "/" + COURSE[x][ui]);
}

// every page we generate: {path, ui, group, title, metaDesc, body, crumbs:[[label, href|null]], jsonld[]}
export function allPages() {
  const pages = [];
  for (const ui of UI_LANGS) {
    const artLinks = Object.keys(ARTICLE).map((k) => ["/" + ARTICLE[k][ui], ARTICLES[k][ui].title]);
    for (const x of TARGETS) {
      const c = coursePage(x, ui, artLinks.filter((_, i) => i !== 3 || x !== "en"));
      pages.push({ path: COURSE[x][ui], ui, group: `course-${x}`, ...c,
        crumbs: [[CRUMB_HOME[ui], HOME[ui]], [plain(c.title.split(" — ")[0]), null]] });
      const t = PT[ui], n = NAMES[ui][x];
      pages.push({ path: TEST[x][ui], ui, group: `test-${x}`, title: t.title(n), metaDesc: t.meta(n), body: placementBody(x, ui),
        crumbs: [[CRUMB_HOME[ui], HOME[ui]], [TESTS_WORD[ui], null], [t.h1(n), null]],
        jsonld: [{ "@type": "Quiz", name: t.h1(n), about: { "@type": "Thing", name: n[1] }, educationalLevel: "A1–C1", inLanguage: ui, provider: { "@id": SITE + "#school" } }] });
    }
    // blog hub
    const B = BLOG_T[ui];
    const cards = Object.keys(ARTICLE).map((k) => {
      const a = ARTICLES[k][ui];
      return `<article class="bcard rv"><a href="/${ARTICLE[k][ui]}"><h2>${a.title}</h2><p>${a.lede}</p><span class="bread">${B.read} →</span></a></article>`;
    }).join("\n      ");
    pages.push({ path: BLOG[ui], ui, group: "blog", title: B.title, metaDesc: B.meta,
      body: `<section class="sub-hero small"><div class="lsec-in"><h1>${B.h1}</h1><p class="lede">${B.lede}</p></div></section>
  <section class="lsec tight"><div class="lsec-in bgrid">
      ${cards}
  </div></section>`,
      crumbs: [[CRUMB_HOME[ui], HOME[ui]], [B.crumb, null]],
      jsonld: [{ "@type": "Blog", name: B.title, inLanguage: ui, publisher: { "@id": SITE + "#school" } }] });
    for (const k of Object.keys(ARTICLE)) {
      const a = ARTICLES[k][ui], date = ARTICLES[k].date;
      const others = Object.keys(ARTICLE).filter((x) => x !== k).map((x) => `<li><a href="/${ARTICLE[x][ui]}">${ARTICLES[x][ui].title}</a></li>`).join("");
      const tests = TARGETS.map((x) => `<a class="btn ghost" href="/${TEST[x][ui]}">${PT[ui].h1(NAMES[ui][x])}</a>`).join("");
      pages.push({ path: ARTICLE[k][ui], ui, group: `art-${k}`, title: `${a.title} | Verba School`, metaDesc: a.meta,
        body: `<article class="post">
    <header class="post-head lsec-in"><p class="eyebrow">${B.crumb} · <time datetime="${date}">${date}</time></p><h1>${a.title}</h1><p class="lede">${a.lede}</p></header>
    <div class="post-body lsec-in">${fillLinks(a.body, ui)}
      <aside class="post-cta"><p>${{ hy: "Իմացեք ձեր մակարդակը՝ անվճար", ru: "Узнайте свой уровень бесплатно", en: "Find your level for free" }[ui]}</p><div class="post-tests">${tests}</div></aside>
      <nav class="more"><h3>${{ hy: "Կարդացեք նաև", ru: "Читайте также", en: "Read also" }[ui]}</h3><ul>${others}</ul></nav>
    </div>
  </article>`,
        crumbs: [[CRUMB_HOME[ui], HOME[ui]], [B.crumb, "/" + BLOG[ui]], [a.title, null]],
        jsonld: [{ "@type": "Article", headline: a.title, description: a.meta, inLanguage: ui, datePublished: date, dateModified: date,
          author: { "@id": SITE + "#school" }, publisher: { "@id": SITE + "#school" }, image: SITE + "img/og.png", mainEntityOfPage: SITE + ARTICLE[k][ui] }] });
    }
    // bring-a-friend referral page
    const R = REF_T[ui];
    pages.push({ path: REFERRAL[ui], ui, group: "referral", title: R.title, metaDesc: R.meta, body: referralBody(ui),
      crumbs: [[CRUMB_HOME[ui], HOME[ui]], [R.crumb, null]],
      jsonld: [{ "@type": "WebPage", name: R.title, description: R.meta, inLanguage: ui, publisher: { "@id": SITE + "#school" } },
        { "@type": "FAQPage", inLanguage: ui, mainEntity: R.rules.map(([q, a]) => ({ "@type": "Question", name: plain(q), acceptedAnswer: { "@type": "Answer", text: plain(a) } })) }] });
  }
  return pages;
}

// links for the footer and the home page, per page language (the Spanish home page links to the English pages)
export function resourceLinks(lang) {
  const ui = UI_LANGS.includes(lang) ? lang : "en";
  const L = { hy: ["Իսպաներենի դասեր", "Անգլերենի դասեր", "Ֆրանսերենի դասեր", "Անվճար թեստ", "Բլոգ"],
    ru: ["Курсы испанского", "Курсы английского", "Курсы французского", "Бесплатный тест", "Блог"],
    en: ["Spanish lessons", "English lessons", "French lessons", "Free level test", "Blog"] }[ui];
  return { ui, items: [["/" + COURSE.es[ui], L[0]], ["/" + COURSE.en[ui], L[1]], ["/" + COURSE.fr[ui], L[2]], ["/" + TEST.en[ui], L[3]], ["/" + BLOG[ui], L[4]]],
    ref: "/" + REFERRAL[ui], refLabel: { hy: "Բեր ընկերոջդ՝ ստացիր 5 000 ֏", ru: "Приведи друга — получи 5 000 ֏", en: "Bring a friend, get 5,000 ֏" }[ui],
    course: (x) => "/" + COURSE[x][ui], test: (x) => "/" + TEST[x][ui], blog: "/" + BLOG[ui],
    articles: Object.keys(ARTICLE).map((k) => ["/" + ARTICLE[k][ui], ARTICLES[k][ui].title, ARTICLES[k][ui].lede]) };
}
