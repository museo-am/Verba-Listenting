// "Bring a friend" referral page: 5 000 AMD per new paying student, as cash or as a discount.
// The forms post to a Google Apps Script (tools/referral-backend.gs): codes and sign-ups go to
// the "Verba referrals" Google Sheet and the school gets a Telegram alert. No Instagram step.
export const REWARD = "5 000 ֏";
// Google Apps Script web app behind the forms (tools/referral-backend.gs, bound to the "Verba referrals" sheet)
export const REF_API = "https://script.google.com/macros/s/AKfycbw1_FV40T2npq0BhPqRGRKzJ-sHfBpU6ct-yqryaqwF0hYz-U5TSkRdo_khxojca2-y/exec";

const F = {
  hy: { busy: "Սպասիր…", share: "Կիսվել հղումով", linkCopied: "Հղումը պատճենված է։ Ուղարկիր ընկերներիդ։", shareText: "Գրանցվիր Verba School-ում իմ կոդով և ստացիր 10% զեղչ առաջին ամսվա համար՝",
    existing: "Այս համարով արդեն կոդ կա՝ ահա այն։", doneH: "Պատրաստ է ✓", doneP: "Մենք քեզ կզանգենք 24 ժամվա ընթացքում՝ դասերն ընտրելու համար։ 10% զեղչը կկիրառվի առաջին ամսվա վճարից։",
    nocode: "Այդպիսի կոդ չկա։ Ստուգիր ընկերոջդ կոդը։", self: "Քո սեփական կոդով գրանցվել չես կարող։", dup: "Այս համարով արդեն գրանցում կա։ Մենք շուտով կզանգենք։", fail: "Չհաջողվեց ուղարկել։ Փորձիր կրկին կամ գրիր մեզ Instagram-ում՝ @verba.school_" },
  ru: { busy: "Подожди…", share: "Поделиться ссылкой", linkCopied: "Ссылка скопирована. Отправь её друзьям.", shareText: "Записывайся в Verba School по моему коду и получи скидку 10% на первый месяц:",
    existing: "На этот номер уже есть код — вот он.", doneH: "Готово ✓", doneP: "Мы позвоним тебе в течение 24 часов, чтобы подобрать занятия. Скидка 10% применится к оплате первого месяца.",
    nocode: "Такого кода нет. Проверь код друга.", self: "Нельзя записаться по собственному коду.", dup: "На этот номер уже есть запись. Мы скоро позвоним.", fail: "Не удалось отправить. Попробуй ещё раз или напиши нам в Instagram: @verba.school_" },
  en: { busy: "Please wait…", share: "Share link", linkCopied: "Link copied. Send it to your friends.", shareText: "Join Verba School with my code and get 10% off your first month:",
    existing: "This number already has a code — here it is.", doneH: "Done ✓", doneP: "We'll call you within 24 hours to pick your lessons. The 10% discount comes off your first month.",
    nocode: "That code doesn't exist. Check your friend's code.", self: "You can't sign up with your own code.", dup: "This number is already signed up. We'll call you soon.", fail: "Couldn't send. Try again or message us on Instagram: @verba.school_" },
};

export const REF_T = {
  hy: {
    title: "Բե՛ր ընկերոջդ և ստացի՛ր 5 000 ֏ | Verba School",
    meta: "Բե՛ր ընկերոջդ սովորելու Verba School-ում․ յուրաքանչյուր նոր աշակերտի համար, ով կգա քո կոդով, ստացիր 5 000 ֏ կանխիկ կամ զեղչ հաջորդ ամսվա համար։",
    crumb: "Բեր ընկերոջդ",
    eyebrow: "Բեր ընկերոջդ սովորելու",
    h1: "Բե՛ր ընկերոջդ և ստացի՛ր <em>5 000 ֏</em>",
    lede: "Յուրաքանչյուր նոր աշակերտի համար, ով կգրանցվի քո կոդով, ստանում ես 5 000 ֏՝ կանխիկ կամ որպես զեղչ հաջորդ ամսվա վճարից, իսկ ընկերդ ստանում է 10% զեղչ առաջին ամսվա համար։ Սահմանափակում չկա։",
    getCode: "Ստանալ իմ կոդը",
    invited: "Ինձ հրավիրել են",
    howH: "Ինչպես է աշխատում",
    how: [
      ["Ստացիր կոդդ", "Գրիր անունդ և հեռախոսահամարդ ներքևում՝ կստանաս քո անձնական կոդը։ Ոչինչ ուղարկել պետք չէ։"],
      ["Կիսվիր ընկերներիդ հետ", "Ընկերդ գրանցվում է քո կոդով և ստանում 10% զեղչ առաջին ամսվա համար։"],
      ["Ստացիր պարգևը", "Երբ ընկերդ վճարի և ավարտի առաջին ամիսը, ստանում ես 5 000 ֏։"],
    ],
    rewardH: "Ընտրիր պարգևդ",
    cash: ["Կանխիկ", "5 000 ֏", "յուրաքանչյուր նոր աշակերտի համար", "Բոլորի համար՝ թե՛ մեր աշակերտների, թե՛ նրանց, ով մեզ մոտ չի սովորում։"],
    disc: ["Զեղչ", "−5 000 ֏", "հաջորդ ամսվա վճարից", "Մեր աշակերտների համար։"],
    formH: "Ստացիր քո կոդը",
    formLede: "Գրիր անունդ և հեռախոսահամարդ։ Կոդը կգրանցվի անմիջապես, իսկ պարգևի համար կզանգենք այս համարով։",
    nameL: "Անուն",
    namePh: "Օրինակ՝ Աննա",
    make: "Ստեղծել կոդը",
    yourCode: "Քո կոդը",
    copy: "Պատճենել կոդը",
    codeCopied: "Կոդը պատճենված է։",
    needName: "Գրիր անունդ։",
    phoneL: "Հեռախոսահամար",
    phonePh: "+374 77 123 456",
    needPhone: "Գրիր ճիշտ հեռախոսահամար։",
    invH: "Քեզ հրավիրե՞լ են՝ ստացիր 10% զեղչ",
    invLede: "Գրիր անունդ, հեռախոսահամարդ և ընկերոջդ կոդը։ Կստանաս 10% զեղչ առաջին ամսվա համար, իսկ ընկերդ՝ իր պարգևը։",
    codeL: "Ընկերոջդ կոդը",
    codePh: "Օրինակ՝ ANNA-47",
    needCode: "Գրիր ընկերոջդ կոդը։",
    signup: "Գրանցվել կոդով",
    rulesH: "Կանոններ",
    rules: [
      ["Ե՞րբ եմ ստանում պարգևը", "Երբ ընկերդ վճարում է և ավարտում առաջին ամիսը։ Կանխիկը վճարում ենք մեկ շաբաթվա ընթացքում, իսկ զեղչը հանվում է քո հաջորդ ամսվա վճարից։"],
      ["Ո՞վ կարող է մասնակցել", "Բոլորը։ Զեղչը հասանելի է միայն մեր աշակերտներին, մյուսները ստանում են կանխիկ։"],
      ["Քանի՞ ընկեր կարող եմ բերել", "Որքան ուզես։ Յուրաքանչյուր նոր աշակերտի համար՝ 5 000 ֏, և՛ խմբային, և՛ անհատական դասերի համար։"],
      ["Ի՞նչ է ստանում ընկերս", "10% զեղչ առաջին ամսվա վճարից՝ և՛ խմբային, և՛ անհատական դասերի համար։ Գրանցվելիս պետք է նշել կոդը և հեռախոսահամարը։"],
      ["Ի՞նչն է հաշվվում", "Միայն նոր աշակերտները, ովքեր առաջին անգամ են գրանցվում և կոդը նշում են գրանցվելիս։ Քեզ ինքդ հրավիրել չես կարող։"],
    ],
  },
  ru: {
    title: "Приведи друга и получи 5 000 ֏ | Verba School",
    meta: "Приведи друга учиться в Verba School: за каждого нового ученика по твоему коду получи 5 000 ֏ наличными или скидкой на следующий месяц.",
    crumb: "Приведи друга",
    eyebrow: "Приведи друга учиться",
    h1: "Приведи друга и получи <em>5 000 ֏</em>",
    lede: "За каждого нового ученика, который запишется по твоему коду, ты получаешь 5 000 ֏ — наличными или скидкой на следующий месяц, а друг получает скидку 10% на первый месяц. Без ограничений.",
    getCode: "Получить мой код",
    invited: "Меня пригласили",
    howH: "Как это работает",
    how: [
      ["Получи код", "Введи имя и номер телефона ниже — получишь личный код. Ничего отправлять не нужно."],
      ["Поделись с друзьями", "Друг записывается по твоему коду и получает скидку 10% на первый месяц."],
      ["Получи награду", "Когда друг оплатит и закончит первый месяц, ты получаешь 5 000 ֏."],
    ],
    rewardH: "Выбери награду",
    cash: ["Наличные", "5 000 ֏", "за каждого нового ученика", "Для всех — и для наших учеников, и для тех, кто у нас не учится."],
    disc: ["Скидка", "−5 000 ֏", "со следующего месяца", "Для наших учеников."],
    formH: "Получи свой код",
    formLede: "Введи имя и номер телефона. Код регистрируется сразу, а по поводу награды мы позвоним на этот номер.",
    nameL: "Имя",
    namePh: "Например, Анна",
    make: "Создать код",
    yourCode: "Твой код",
    copy: "Скопировать код",
    codeCopied: "Код скопирован.",
    needName: "Введи имя.",
    phoneL: "Номер телефона",
    phonePh: "+374 77 123 456",
    needPhone: "Введи правильный номер телефона.",
    invH: "Тебя пригласили? Получи скидку 10%",
    invLede: "Введи имя, номер телефона и код друга. Ты получишь скидку 10% на первый месяц, а друг — свою награду.",
    codeL: "Код друга",
    codePh: "Например, ANNA-47",
    needCode: "Введи код друга.",
    signup: "Записаться с кодом",
    rulesH: "Правила",
    rules: [
      ["Когда я получу награду?", "Когда друг оплатит и закончит первый месяц. Наличные выплачиваем в течение недели, скидка вычитается из оплаты следующего месяца."],
      ["Кто может участвовать?", "Все. Скидка — только для наших учеников, остальные получают наличные."],
      ["Сколько друзей можно привести?", "Сколько угодно. За каждого нового ученика — 5 000 ֏, и в группе, и на индивидуальных занятиях."],
      ["Что получает мой друг?", "Скидку 10% на оплату первого месяца — и в группе, и на индивидуальных занятиях. При записи нужно указать код и номер телефона."],
      ["Кто засчитывается?", "Только новые ученики, которые записываются впервые и называют код при записи. Пригласить самого себя нельзя."],
    ],
  },
  en: {
    title: "Bring a friend, get 5,000 AMD | Verba School",
    meta: "Bring a friend to learn at Verba School: for every new student who joins with your code, get 5,000 AMD in cash or off your next month.",
    crumb: "Bring a friend",
    eyebrow: "Bring a friend to learn",
    h1: "Bring a friend, get <em>5,000 ֏</em>",
    lede: "For every new student who joins with your code, you get 5,000 ֏ — in cash or off your next month, and your friend gets 10% off their first month. No limit.",
    getCode: "Get my code",
    invited: "I was invited",
    howH: "How it works",
    how: [
      ["Get your code", "Type your name and phone number below to get your personal code. Nothing to send."],
      ["Share it with friends", "Your friend signs up with your code and gets 10% off their first month."],
      ["Get your reward", "When your friend pays and finishes their first month, you get 5,000 ֏."],
    ],
    rewardH: "Choose your reward",
    cash: ["Cash", "5,000 ֏", "for every new student", "For everyone — our students and people who don't study with us."],
    disc: ["Discount", "−5,000 ֏", "off your next month", "For our students."],
    formH: "Get your code",
    formLede: "Type your name and phone number. Your code is registered right away, and we'll call this number about your reward.",
    nameL: "Name",
    namePh: "e.g. Anna",
    make: "Make my code",
    yourCode: "Your code",
    copy: "Copy code",
    codeCopied: "Code copied.",
    needName: "Type your name.",
    phoneL: "Phone number",
    phonePh: "+374 77 123 456",
    needPhone: "Type a valid phone number.",
    invH: "Were you invited? Get 10% off",
    invLede: "Type your name, phone number and your friend's code. You get 10% off your first month, and your friend gets their reward.",
    codeL: "Friend's code",
    codePh: "e.g. ANNA-47",
    needCode: "Type your friend's code.",
    signup: "Sign up with code",
    rulesH: "Rules",
    rules: [
      ["When do I get my reward?", "When your friend pays and finishes their first month. Cash is paid within a week; a discount comes off your next month's payment."],
      ["Who can join?", "Everyone. The discount is for our students only; everyone else gets cash."],
      ["How many friends can I bring?", "As many as you like. 5,000 ֏ for every new student, in group or private lessons."],
      ["What does my friend get?", "10% off their first month, in group or private lessons. They need to give the code and their phone number when they sign up."],
      ["Who counts?", "Only new students signing up for the first time who give the code when they sign up. You can't refer yourself."],
    ],
  },
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function referralBody(ui) {
  const t = { ...REF_T[ui], ...F[ui] };
  const card = ([h, amt, per, note], solo) => `<article class="price${solo ? " solo" : ""} rv">
          <div class="ptop"><h3>${h}</h3></div>
          <p class="amount"><b>${amt}</b><span>${per}</span></p>
          <p class="pdesc">${note}</p>
        </article>`;
  return `
  <section class="sub-hero">
    <div class="lsec-in">
      <p class="eyebrow chipline"><span class="pulse" aria-hidden="true"></span><span>${t.eyebrow}</span></p>
      <h1>${t.h1}</h1>
      <p class="lede">${t.lede}</p>
      <div class="hero-cta"><a class="btn big" href="#refcode">${t.getCode}</a><a class="btn big ghost" href="#refinv">${t.invited}</a></div>
    </div>
  </section>
  <section class="lsec tight">
    <div class="lsec-in">
      <div class="shead rv"><h2>${t.howH}</h2></div>
      <ul class="howlist rv">${t.how.map(([h, p]) => `<li><b>${h}</b><span>${p}</span></li>`).join("")}</ul>
    </div>
  </section>
  <section class="lsec tight">
    <div class="lsec-in">
      <div class="shead rv"><h2>${t.rewardH}</h2></div>
      <div class="prices">
        ${card(t.cash, false)}
        ${card(t.disc, true)}
      </div>
    </div>
  </section>
  <section class="lsec tight">
    <div class="lsec-in refforms" data-api="${REF_API}" data-lang="${ui}" data-busy="${esc(t.busy)}" data-fail="${esc(t.fail)}" data-code-copied="${esc(t.codeCopied)}" data-link-copied="${esc(t.linkCopied)}" data-share-text="${esc(t.shareText)}"
      data-need="${esc(t.needName)}" data-need-phone="${esc(t.needPhone)}" data-need-code="${esc(t.needCode)}" data-existing="${esc(t.existing)}" data-nocode="${esc(t.nocode)}" data-self="${esc(t.self)}" data-dup="${esc(t.dup)}">
      <form class="panel refform rv" id="refcode" novalidate>
        <h2>${t.formH}</h2>
        <p class="hint">${t.formLede}</p>
        <div class="field"><label for="refname">${t.nameL}</label><input class="input" id="refname" name="name" autocomplete="name" placeholder="${esc(t.namePh)}" maxlength="40" required></div>
        <div class="field"><label for="refphone">${t.phoneL}</label><input class="input" id="refphone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="${esc(t.phonePh)}" maxlength="20" required></div>
        <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn big" type="submit">${t.make}</button>
        <div class="refout" hidden>
          <p class="eyebrow">${t.yourCode}</p>
          <p class="refcode-big" id="refcodeval" aria-live="polite"></p>
          <div class="hero-cta"><button class="btn big" type="button" data-ref-share>${t.share}</button><button class="btn big ghost" type="button" data-ref-copy>${t.copy}</button></div>
        </div>
        <p class="pmsg" role="status"></p>
      </form>
      <form class="panel refform rv" id="refinv" novalidate>
        <h2>${t.invH}</h2>
        <p class="hint">${t.invLede}</p>
        <div class="field"><label for="invname">${t.nameL}</label><input class="input" id="invname" name="name" autocomplete="name" placeholder="${esc(t.namePh)}" maxlength="40" required></div>
        <div class="field"><label for="invphone">${t.phoneL}</label><input class="input" id="invphone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="${esc(t.phonePh)}" maxlength="20" required></div>
        <div class="field"><label for="invcode">${t.codeL}</label><input class="input" id="invcode" name="code" autocapitalize="characters" autocomplete="off" placeholder="${esc(t.codePh)}" maxlength="12" required></div>
        <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn big" type="submit">${t.signup}</button>
        <div class="refdone" hidden><p class="refdone-h">${t.doneH}</p><p>${t.doneP}</p></div>
        <p class="pmsg" role="status"></p>
      </form>
    </div>
  </section>
  <section class="lsec tight">
    <div class="lsec-in">
      <div class="shead rv"><h2>${t.rulesH}</h2></div>
      <div class="faq rv">${t.rules.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
    </div>
  </section>`;
}
