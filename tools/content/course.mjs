// Course pages: "Spanish / English / French lessons online", one per target language and page language.
// Everything stated here is what the school already says elsewhere (prices, format, certificate, levels).
import { COURSE, TEST, ARTICLE } from "./routes.mjs";

const IG = "https://www.instagram.com/verba.school_/";

// language names in each page language: [lessons-of title, plain name, "learn X" form]
export const NAMES = {
  hy: { es: ["Իսպաներենի", "իսպաներեն", "Իսպաներեն"], en: ["Անգլերենի", "անգլերեն", "Անգլերեն"], fr: ["Ֆրանսերենի", "ֆրանսերեն", "Ֆրանսերեն"] },
  ru: { es: ["Испанского", "испанский", "Испанский"], en: ["Английского", "английский", "Английский"], fr: ["Французского", "французский", "Французский"] },
  en: { es: ["Spanish", "Spanish", "Spanish"], en: ["English", "English", "English"], fr: ["French", "French", "French"] },
};
const NATIVE = { es: "Español", en: "English", fr: "Français" };

// why this language: facts with their sources
const WHY = {
  hy: {
    es: "Իսպաներենը մայրենի է մոտ 500 միլիոն մարդու համար և աշխարհում ամենաշատ մայրենի խոսողներ ունեցող լեզուներից է։ Այն պաշտոնական լեզու է Իսպանիայում և Լատինական Ամերիկայի երկրների մեծ մասում։",
    en: "Անգլերենը միջազգային հաղորդակցության հիմնական լեզուն է՝ աշխատանքի, ուսման, ճամփորդությունների և համացանցի համար։",
    fr: "Ֆրանսերենով խոսում է ավելի քան 300 միլիոն մարդ, և այն պաշտոնական լեզու է տասնյակ երկրներում ու միջազգային կազմակերպություններում։",
  },
  ru: {
    es: "Испанский — родной язык примерно для 500 миллионов человек и один из самых распространённых родных языков в мире. Это официальный язык Испании и большинства стран Латинской Америки.",
    en: "Английский — главный язык международного общения: для работы, учёбы, путешествий и интернета.",
    fr: "На французском говорят более 300 миллионов человек; это официальный язык десятков стран и международных организаций.",
  },
  en: {
    es: "Spanish is the native language of about 500 million people, one of the largest native-speaker communities in the world. It's the official language of Spain and most of Latin America.",
    en: "English is the main language of international communication: for work, study, travel and the internet.",
    fr: "French is spoken by more than 300 million people and is an official language of dozens of countries and international organisations.",
  },
};

const T = {
  hy: {
    eyebrow: "Verba School · առցանց",
    h1: (n) => `${n[0]} դասեր առցանց՝ զրոյից մինչև C1`,
    title: (n) => `${n[0]} դասեր առցանց — Verba School`,
    meta: (n) => `${n[0]} առցանց դասեր A1-ից մինչև C1՝ բացատրությունները հայերենով։ Խմբային (25 000 ֏) և անհատական (30 000 ֏) դասեր, լսողական հարթակ, մակարդակի թեստեր և հավաստագիր։`,
    lede: (n) => `Սովորեք ${n[1]} տնից՝ խմբում կամ անհատապես։ Քերականությունը բացատրում ենք հայերենով, իսկ լսելն ու խոսելը զարգացնում ենք իրական տեքստերով և ձայնագրություններով։`,
    ctaTest: "Անվճար թեստ՝ իմացեք ձեր մակարդակը",
    whyT: (n) => `Ինչու ${n[1]}`,
    howT: "Ինչպես ենք սովորեցնում",
    how: [
      ["Բացատրություններ հայերենով", "Քերականությունը պարզ է դառնում, երբ այն բացատրում են մայրենի լեզվով։"],
      ["Ձայնագրված լսողական առաջադրանքներ", "Տեքստեր ձեր մակարդակի համար՝ ձայնագրությամբ, տեքստով, բառապաշարով և հարցերով։ Ցանկացած բառի վրա սեղմելով՝ տեսնում եք թարգմանությունը։"],
      ["Մակարդակի թեստեր", "Յուրաքանչյուր մակարդակի վերջում թեստը ցույց է տալիս՝ պատրաստ եք արդյոք հաջորդին։"],
      ["Դասեր հենց կայքում", "Տեսադասերը անցնում են Verba-ի կայքում՝ հեռախոսից կամ համակարգչից, առանց որևէ բան տեղադրելու։"],
      ["Հավաստագիր", "Դասընթացի ավարտին ստանում եք Verba School-ի հավաստագիր։"],
    ],
    levelsT: "Մակարդակներ",
    pricesT: "Ձևաչափ և արժեք",
    group: "Խմբային դասեր", priv: "Անհատական դասեր", perMonth: "ամսական",
    groupD: "Սովորեք այլ աշակերտների հետ միասին։", privD: "Դասեր՝ մեկը մեկին, ձեր տեմպով։",
    signUp: "Գրանցվել",
    demoT: "Փորձեք մեր լսողական հարթակը",
    demoD: "Սա իրական դասի հատված է։ Սեղմեք ▶, հետևեք տեքստին և պատասխանեք հարցին։",
    stepsT: "Ինչպես սկսել",
    steps: (testHref) => [
      `Անցեք <a href="${testHref}">անվճար թեստը</a>՝ ձեր մակարդակը պարզելու համար (կամ սկսեք զրոյից)։`,
      `Գրեք մեզ <a href="${IG}" target="_blank" rel="noopener">Instagram-ում</a> կամ զանգահարեք՝ <span class="tel">+374 77 30 85 25</span>։`,
      "Ընտրեք խմբային կամ անհատական ձևաչափը և սկսեք դասերը։",
    ],
    faqT: "Հաճախ տրվող հարցեր",
    faq: (n, testHref, howlong) => [
      [`Կարո՞ղ եմ սկսել ${n[1]} զրոյից`, `Այո։ A1 մակարդակը նախատեսված է նրանց համար, ովքեր նոր են սկսում։ Բոլոր բացատրությունները հայերենով են։`],
      ["Ինչպե՞ս են անցնում դասերը", "Բոլոր դասերը առցանց են՝ հենց Verba School-ի կայքում, հեռախոսից կամ համակարգչից։ Կարող եք ընտրել խմբային կամ անհատական դասեր։"],
      ["Որքա՞ն արժեն դասերը", "Խմբային դասերը՝ 25 000 ֏ ամսական, անհատական դասերը՝ 30 000 ֏ ամսական։"],
      ["Ինչպե՞ս իմանամ իմ մակարդակը", `Անցեք մեր <a href="${testHref}">անվճար թեստը</a>։ Այն մոտավորապես ցույց կտա ձեր մակարդակը, իսկ ուսուցիչը կճշտի այն առաջին դասին։`],
      ["Հավաստագիր տալի՞ս եք", "Այո, դասընթացի ավարտին տալիս ենք Verba School-ի հավաստագիր։"],
      [`Որքա՞ն ժամանակ է պետք ${n[1]} սովորելու համար`, `Կախված է նպատակից և պարապմունքների հաճախականությունից։ Մանրամասն կարդացեք <a href="${howlong}">այս հոդվածում</a>։`],
    ],
    moreT: "Կարդացեք նաև",
    crumbHome: "Գլխավոր",
  },
  ru: {
    eyebrow: "Verba School · онлайн",
    h1: (n) => `Курсы ${n[0].toLowerCase()} онлайн — с нуля до C1`,
    title: (n) => `Курсы ${n[0].toLowerCase()} онлайн — Verba School`,
    meta: (n) => `Онлайн-курсы ${n[0].toLowerCase()} языка с A1 до C1 с объяснениями на армянском. Групповые (25 000 ֏) и индивидуальные (30 000 ֏) занятия, платформа для аудирования, тесты уровня и сертификат.`,
    lede: (n) => `Учите ${n[1]} из дома — в группе или индивидуально. Грамматику объясняем на армянском, а аудирование и разговорную речь развиваем на реальных текстах и записях.`,
    ctaTest: "Бесплатный тест: узнайте свой уровень",
    whyT: (n) => `Почему ${n[1]}`,
    howT: "Как мы учим",
    how: [
      ["Объяснения на армянском", "Грамматика становится понятной, когда её объясняют на родном языке."],
      ["Записанные задания по аудированию", "Тексты для вашего уровня — с записью, расшифровкой, словарём и вопросами. Нажмите на любое слово, чтобы увидеть перевод."],
      ["Тесты уровня", "В конце каждого уровня тест показывает, готовы ли вы к следующему."],
      ["Занятия прямо на сайте", "Видеоуроки проходят на сайте Verba — с телефона или компьютера, ничего устанавливать не нужно."],
      ["Сертификат", "По окончании курса вы получаете сертификат Verba School."],
    ],
    levelsT: "Уровни",
    pricesT: "Формат и стоимость",
    group: "Групповые занятия", priv: "Индивидуальные занятия", perMonth: "в месяц",
    groupD: "Учитесь вместе с другими студентами.", privD: "Один на один, в вашем темпе.",
    signUp: "Записаться",
    demoT: "Попробуйте нашу платформу для аудирования",
    demoD: "Это фрагмент настоящего урока. Нажмите ▶, следите за текстом и ответьте на вопрос.",
    stepsT: "Как начать",
    steps: (testHref) => [
      `Пройдите <a href="${testHref}">бесплатный тест</a>, чтобы узнать свой уровень (или начните с нуля).`,
      `Напишите нам в <a href="${IG}" target="_blank" rel="noopener">Instagram</a> или позвоните: <span class="tel">+374 77 30 85 25</span>.`,
      "Выберите групповой или индивидуальный формат и начинайте занятия.",
    ],
    faqT: "Частые вопросы",
    faq: (n, testHref, howlong) => [
      [`Можно ли начать ${n[1]} с нуля?`, "Да. Уровень A1 рассчитан на тех, кто только начинает. Все объяснения — на армянском."],
      ["Как проходят занятия?", "Все занятия онлайн — прямо на сайте Verba School, с телефона или компьютера. Можно выбрать групповые или индивидуальные занятия."],
      ["Сколько стоят занятия?", "Групповые — 25 000 ֏ в месяц, индивидуальные — 30 000 ֏ в месяц."],
      ["Как узнать свой уровень?", `Пройдите наш <a href="${testHref}">бесплатный тест</a>. Он примерно покажет ваш уровень, а преподаватель уточнит его на первом занятии.`],
      ["Вы выдаёте сертификат?", "Да, по окончании курса мы выдаём сертификат Verba School."],
      [`Сколько времени нужно, чтобы выучить ${n[1]}?`, `Зависит от цели и частоты занятий. Подробно — <a href="${howlong}">в этой статье</a>.`],
    ],
    moreT: "Читайте также",
    crumbHome: "Главная",
  },
  en: {
    eyebrow: "Verba School · online",
    h1: (n) => `${n[0]} lessons online, from zero to C1`,
    title: (n) => `${n[0]} lessons online — Verba School`,
    meta: (n) => `Online ${n[0]} lessons from A1 to C1 with explanations in Armenian. Group (25,000 AMD) and private (30,000 AMD) lessons, a listening platform, level tests and a certificate.`,
    lede: (n) => `Learn ${n[1]} from home, in a group or one-on-one. We explain grammar in Armenian and build your listening and speaking with real texts and recordings.`,
    ctaTest: "Free test: find your level",
    whyT: (n) => `Why ${n[1]}`,
    howT: "How we teach",
    how: [
      ["Explanations in Armenian", "Grammar makes sense when it's explained in your own language."],
      ["Recorded listening tasks", "Texts for your level with a recording, transcript, vocabulary and questions. Tap any word to see its translation."],
      ["Level tests", "At the end of each level, a test shows whether you're ready for the next one."],
      ["Lessons right on the site", "Video lessons happen on the Verba website, from a phone or computer, with nothing to install."],
      ["Certificate", "At the end of the course you receive a Verba School certificate."],
    ],
    levelsT: "Levels",
    pricesT: "Format and prices",
    group: "Group lessons", priv: "Private lessons", perMonth: "per month",
    groupD: "Learn together with other students.", privD: "One-on-one lessons at your own pace.",
    signUp: "Sign up",
    demoT: "Try our listening platform",
    demoD: "This is part of a real lesson. Press ▶, follow the text and answer the question.",
    stepsT: "How to start",
    steps: (testHref) => [
      `Take the <a href="${testHref}">free test</a> to find your level (or start from zero).`,
      `Message us on <a href="${IG}" target="_blank" rel="noopener">Instagram</a> or call <span class="tel">+374 77 30 85 25</span>.`,
      "Choose group or private lessons and start.",
    ],
    faqT: "Frequently asked questions",
    faq: (n, testHref, howlong) => [
      [`Can I start ${n[1]} from zero?`, "Yes. Level A1 is for complete beginners, and all explanations are in Armenian."],
      ["How do the lessons work?", "All lessons are online, right on the Verba School website, from a phone or computer. You can choose group or private lessons."],
      ["How much do lessons cost?", "Group lessons are 25,000 AMD per month and private lessons are 30,000 AMD per month."],
      ["How do I find out my level?", `Take our <a href="${testHref}">free test</a>. It gives an approximate level, and your teacher confirms it in the first lesson.`],
      ["Do you give a certificate?", "Yes, at the end of the course you receive a Verba School certificate."],
      [`How long does it take to learn ${n[1]}?`, `It depends on your goal and how often you study. Read more <a href="${howlong}">in this article</a>.`],
    ],
    moreT: "Read also",
    crumbHome: "Home",
  },
};

const LV = {
  hy: [["A1", "Սկսնակ"], ["A2", "Տարրական"], ["B1", "Միջին"], ["B2", "Միջինից բարձր"], ["C1", "Առաջադեմ"]],
  ru: [["A1", "Начальный"], ["A2", "Элементарный"], ["B1", "Средний"], ["B2", "Выше среднего"], ["C1", "Продвинутый"]],
  en: [["A1", "Beginner"], ["A2", "Elementary"], ["B1", "Intermediate"], ["B2", "Upper intermediate"], ["C1", "Advanced"]],
};

// real excerpts with their recordings (the clips live in /demo)
const DEMOS = {
  es: { src: "/demo/lucia.mp3", dur: 17.25, title: "Me llamo Lucía", meta: "Presentarse · Narradora",
    peaks: "8,86,70,8,22,88,78,48,47,17,8,48,73,100,62,55,41,11,8,8,54,76,73,44,8,16,70,69,67,68,57,58,63,46,55,42,8,8,8,8,82,76,70,55,58,54,68,62,55,48,18,8,8,8,8,75,61,68,32,8,8,55,64,77,61,78,64,56,38,13,8,8",
    sents: [[0, 'Hola, me llamo Lucía y tengo <mark class="v" tabindex="0" data-hy="քսաներկու">veintidós</mark> años.'], [4.80, "Soy de Valencia, una ciudad grande en el este de España."], [9.55, 'Vivo en un <mark class="v" tabindex="0" data-hy="բնակարան">piso</mark> pequeño con mi <mark class="v" tabindex="0" data-hy="քույր">hermana</mark> Marta.'], [13.12, "Soy estudiante."], [14.58, "Estudio Medicina en la universidad."]],
    q: ["¿Con quién vive Lucía?", ["Con sus padres", "Con su hermana", "Sola"], 1] },
  fr: { src: "/demo/chloe.mp3", dur: 15.75, title: "Je m'appelle Chloé", meta: "Se présenter · Narratrice",
    peaks: "25,90,70,18,8,8,8,8,32,99,63,76,83,72,57,48,11,8,8,8,17,76,74,76,47,88,94,71,62,70,57,71,38,8,8,8,8,8,26,63,70,59,79,93,68,63,81,52,16,8,8,8,8,30,63,76,82,84,73,64,55,64,72,79,100,61,36,27,8,8,8,8",
    sents: [[0, "Bonjour !"], [1.87, "Je m'appelle Chloé et j'ai vingt-cinq ans."], [4.52, '<mark class="v" tabindex="0" data-hy="ապրում եմ">J\'habite</mark> à Lyon, une grande ville dans le sud-est de la France.'], [8.45, 'Je suis <mark class="v" tabindex="0" data-hy="ուսուցչուհի">professeure</mark> de musique dans une école.'], [11.71, "Je travaille du lundi au vendredi, de huit heures et demie à quatre heures."]],
    q: ["Où habite Chloé ?", ["À Paris", "À Lyon", "À Nice"], 1] },
};

export function demoHtml(target, demoLang) {
  const d = DEMOS[target];
  if (!d) return "";
  return `<div class="demo rv" id="demo" lang="${target}" data-dur="${d.dur}">
        <div class="demo-head"><span class="lvb">A1</span><span class="demo-meta">${d.meta}</span><span class="demo-live"><i></i>Verba Listenings</span></div>
        <b class="demo-title">${d.title}</b>
        <div class="demo-player">
          <button class="demo-play" type="button" aria-label="Play"><svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg><svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg></button>
          <div class="wave" data-peaks="${d.peaks}" role="slider" aria-label="Progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0"></div>
          <span class="demo-time">0:00</span>
        </div>
        <p class="demo-text">${d.sents.map(([t, s]) => `<span class="s" data-t0="${t}">${s}</span>`).join(" ")}</p>
        <div class="demo-q"><b>${d.q[0]}</b><div class="opts">${d.q[1].map((o, i) => `<button type="button" class="dopt"${i === d.q[2] ? " data-ok" : ""}><i>${"abc"[i]}</i>${o}</button>`).join("")}</div></div>
        <audio preload="none" src="${d.src}"></audio>
      </div>`;
}

export function coursePage(target, ui, articleTitles) {
  const t = T[ui], n = NAMES[ui][target];
  const testHref = "/" + TEST[target][ui], howlong = "/" + ARTICLE.howlong[ui];
  const faq = t.faq(n, testHref, howlong);
  const body = `
  <section class="sub-hero">
    <div class="lsec-in">
      <p class="eyebrow chipline"><span class="pulse" aria-hidden="true"></span><span>${t.eyebrow}</span></p>
      <p class="native-big" lang="${target}" aria-hidden="true">${NATIVE[target]}</p>
      <h1>${t.h1(n)}</h1>
      <p class="lede">${t.lede(n)}</p>
      <div class="hero-cta">
        <a class="btn big" href="${IG}" target="_blank" rel="noopener">${t.signUp}</a>
        <a class="btn big ghost" href="${testHref}">${t.ctaTest}<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </div>
    </div>
  </section>

  <section class="lsec">
    <div class="lsec-in split2">
      <div class="shead rv"><h2>${t.whyT(n)}</h2><p class="lede">${WHY[ui][target]}</p></div>
      <ul class="howlist rv">${t.how.map(([h, p]) => `<li><b>${h}</b><span>${p}</span></li>`).join("")}</ul>
    </div>
  </section>

  ${DEMOS[target] ? `<section class="lsec alt">
    <div class="lsec-in split">
      <div class="plat-copy rv"><p class="eyebrow">Verba Listenings</p><h2>${t.demoT}</h2><p class="lede">${t.demoD}</p></div>
      ${demoHtml(target)}
    </div>
  </section>` : ""}

  <section class="lsec${DEMOS[target] ? "" : " alt"}">
    <div class="lsec-in">
      <div class="shead rv"><p class="eyebrow">CEFR</p><h2>${t.levelsT}</h2></div>
      <ol class="lvrow rv">${LV[ui].map(([c, nm]) => `<li><span class="node">${c}</span><b>${nm}</b></li>`).join("")}</ol>
    </div>
  </section>

  <section class="lsec alt" id="precios">
    <div class="lsec-in">
      <div class="shead rv"><h2>${t.pricesT}</h2></div>
      <div class="prices">
        <article class="price rv"><div class="ptop"><h3>${t.group}</h3></div><p class="pdesc">${t.groupD}</p>
          <p class="amount"><b>25 000 ֏</b><span>${t.perMonth}</span></p>
          <a class="btn big" href="${IG}" target="_blank" rel="noopener">${t.signUp}</a></article>
        <article class="price solo rv"><div class="ptop"><h3>${t.priv}</h3><span class="one">1 : 1</span></div><p class="pdesc">${t.privD}</p>
          <p class="amount"><b>30 000 ֏</b><span>${t.perMonth}</span></p>
          <a class="btn big" href="${IG}" target="_blank" rel="noopener">${t.signUp}</a></article>
      </div>
    </div>
  </section>

  <section class="lsec">
    <div class="lsec-in split2">
      <div class="shead rv"><h2>${t.stepsT}</h2></div>
      <ol class="ticks rv">${t.steps(testHref).map((s) => `<li><span>${s}</span></li>`).join("")}</ol>
    </div>
  </section>

  <section class="lsec alt">
    <div class="lsec-in">
      <div class="shead rv"><h2>${t.faqT}</h2></div>
      <div class="faq rv">${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
      <div class="more rv"><h3>${t.moreT}</h3><ul>${articleTitles.map(([href, title]) => `<li><a href="${href}">${title}</a></li>`).join("")}</ul></div>
    </div>
  </section>`;
  const plain = (s) => s.replace(/<[^>]+>/g, "");
  return {
    title: t.title(n), metaDesc: t.meta(n), body,
    crumbs: [[t.crumbHome, null], [`${n[0]}${ui === "en" ? "" : ""}`, null]],
    jsonld: [
      { "@type": "Course", name: plain(t.h1(n)), description: t.meta(n), inLanguage: target, educationalLevel: "A1–C1 (CEFR)",
        provider: { "@id": "https://verba-school.online/#school" },
        hasCourseInstance: [{ "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT1H" }],
        offers: [{ "@type": "Offer", category: "Group", price: 25000, priceCurrency: "AMD" }, { "@type": "Offer", category: "Private", price: 30000, priceCurrency: "AMD" }] },
      { "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: plain(q), acceptedAnswer: { "@type": "Answer", text: plain(a) } })) },
    ],
  };
}
