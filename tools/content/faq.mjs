// Home-page FAQ (all four site languages). Shown as a section on the landing pages, marked up as FAQPage,
// and copied into /llms.txt. Every answer repeats facts already stated elsewhere on the site (prices, levels,
// online format, certificate, free test, bring-a-friend terms, contacts): keep it that way when editing.
// {{TEST}} {{REF}} are filled with the page language's links.
export const FAQ_T = { hy: "Հաճախ տրվող հարցեր", ru: "Частые вопросы", en: "Frequently asked questions", es: "Preguntas frecuentes" };

export const FAQ = {
  hy: [
    ["Ի՞նչ է Verba School-ը", "Verba School-ը լեզուների առցանց դպրոց է Հայաստանում։ Դասավանդում ենք իսպաներեն, անգլերեն և ֆրանսերեն՝ A1-ից մինչև C1 մակարդակ, իսկ բացատրությունները հայերեն են։"],
    ["Ինչպե՞ս են անցնում դասերը", "Բոլոր դասերն առցանց են՝ խմբային կամ անհատական։ Սովորում եք տնից՝ առանց ճանապարհին ժամանակ կորցնելու։ Աշակերտները ստանում են անձնական հղումներ լսողական առաջադրանքներին, մակարդակի թեստերին և առցանց դասերին։"],
    ["Որքա՞ն արժեն դասերը", "Խմբային դասերը՝ 25 000 ֏ ամսական, անհատական դասերը՝ 30 000 ֏ ամսական։"],
    ["Ինչպե՞ս իմանալ իմ մակարդակը", "Անցեք մեր <a href=\"{{TEST}}\">անվճար առցանց թեստը</a>՝ 20 հարց, մոտ 10 րոպե։ Առաջին դասին ուսուցիչը կճշտի ձեր մակարդակը։"],
    ["Հավաստագիր տալի՞ս եք", "Այո, դասընթացի ավարտին ստանում եք հավաստագիր։"],
    ["Զեղչեր կա՞ն", "Եթե ընկերը գրանցվում է ձեր կոդով, նա ստանում է 10% զեղչ առաջին ամսվա համար, իսկ դուք՝ 5 000 ֏։ Մանրամասները՝ <a href=\"{{REF}}\">Բեր ընկերոջդ</a> էջում։"],
    ["Ինչպե՞ս գրանցվել", "Գրեք մեզ Instagram-ում՝ <a href=\"https://www.instagram.com/verba.school_/\">@verba.school_</a>, կամ զանգահարեք <a href=\"tel:+37477308525\">+374 77 30 85 25</a>։"],
  ],
  ru: [
    ["Что такое Verba School?", "Verba School — онлайн-школа языков в Армении. Мы преподаём испанский, английский и французский с уровня A1 до C1, объяснения — на армянском."],
    ["Как проходят занятия?", "Все занятия — онлайн, в группе или индивидуально. Вы учитесь из дома, не теряя времени на дорогу. Ученики получают личные ссылки на аудирование, тесты уровня и онлайн-занятия."],
    ["Сколько стоят занятия?", "Групповые занятия — 25 000 ֏ в месяц, индивидуальные — 30 000 ֏ в месяц."],
    ["Как узнать свой уровень?", "Пройдите наш <a href=\"{{TEST}}\">бесплатный онлайн-тест</a>: 20 вопросов, около 10 минут. На первом занятии преподаватель уточнит уровень."],
    ["Выдаёте ли вы сертификат?", "Да, по окончании курса вы получаете сертификат."],
    ["Есть ли скидки?", "Если друг записывается по вашему коду, он получает скидку 10% на первый месяц, а вы — 5 000 ֏. Подробнее на странице <a href=\"{{REF}}\">«Приведи друга»</a>."],
    ["Как записаться?", "Напишите нам в Instagram <a href=\"https://www.instagram.com/verba.school_/\">@verba.school_</a> или позвоните по номеру <a href=\"tel:+37477308525\">+374 77 30 85 25</a>."],
  ],
  en: [
    ["What is Verba School?", "Verba School is an online language school in Armenia. We teach Spanish, English and French from A1 to C1, with explanations in Armenian."],
    ["How do the lessons work?", "All lessons are online, in a group or one-on-one, so you learn from home without wasting time on the road. Students get personal links to listening tasks, level tests and online lessons."],
    ["How much do lessons cost?", "Group lessons are 25,000 AMD a month and private lessons are 30,000 AMD a month."],
    ["How do I find my level?", "Take our <a href=\"{{TEST}}\">free online level test</a>: 20 questions, about 10 minutes. Your teacher confirms your level in the first lesson."],
    ["Do you give a certificate?", "Yes, you get a certificate when you finish the course."],
    ["Are there discounts?", "If a friend signs up with your code, they get 10% off their first month and you get 5,000 AMD. See <a href=\"{{REF}}\">Bring a friend</a>."],
    ["How do I sign up?", "Message us on Instagram at <a href=\"https://www.instagram.com/verba.school_/\">@verba.school_</a> or call <a href=\"tel:+37477308525\">+374 77 30 85 25</a>."],
  ],
  es: [
    ["¿Qué es Verba School?", "Verba School es una escuela de idiomas online en Armenia. Enseñamos español, inglés y francés del nivel A1 al C1, con explicaciones en armenio."],
    ["¿Cómo son las clases?", "Todas las clases son online, en grupo o individuales: aprendes desde casa, sin perder tiempo en desplazamientos. Los alumnos reciben enlaces personales a audiciones, tests de nivel y clases online."],
    ["¿Cuánto cuestan las clases?", "Las clases en grupo cuestan 25 000 AMD al mes y las individuales, 30 000 AMD al mes."],
    ["¿Cómo sé mi nivel?", "Haz nuestro <a href=\"{{TEST}}\">test de nivel gratuito</a>: 20 preguntas, unos 10 minutos. El profesor confirma tu nivel en la primera clase."],
    ["¿Dais certificado?", "Sí, al terminar el curso recibes un certificado."],
    ["¿Hay descuentos?", "Si un amigo se apunta con tu código, recibe un 10 % de descuento en el primer mes y tú, 5 000 AMD. Más información en <a href=\"{{REF}}\">Trae a un amigo</a>."],
    ["¿Cómo me apunto?", "Escríbenos en Instagram a <a href=\"https://www.instagram.com/verba.school_/\">@verba.school_</a> o llama al <a href=\"tel:+37477308525\">+374 77 30 85 25</a>."],
  ],
};
