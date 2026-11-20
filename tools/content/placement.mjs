// Free public placement tests: 20 questions each, 4 per level from A1 to C1.
// These are separate from the tutors' private level tests. The correct option is written first;
// the page shuffles the options with a fixed seed.
export const PLACEMENT = {
  es: [
    // A1
    ["Hola, ¿cómo te ___?", ["llamas", "llamo", "llama", "llaman"]],
    ["Nosotros ___ de Armenia.", ["somos", "estamos", "son", "están"]],
    ["Me gusta ___ música.", ["la", "el", "los", "un"]],
    ["¿Dónde ___ el baño?", ["está", "es", "hay", "son"]],
    // A2
    ["Ayer ___ al cine con mis amigos.", ["fui", "voy", "iba", "iré"]],
    ["Cuando era niño, ___ mucho al fútbol.", ["jugaba", "jugué", "juego", "he jugado"]],
    ["Este año ___ a México dos veces.", ["he viajado", "viajaba", "viajaría", "viajara"]],
    ["Mi hermano es ___ alto que yo.", ["más", "muy", "tan", "mucho"]],
    // B1
    ["Espero que ___ un buen viaje.", ["tengas", "tienes", "tendrás", "tener"]],
    ["Si tengo tiempo, te ___ mañana.", ["llamaré", "llamaría", "llamara", "llamé"]],
    ["Cuando llegué, la película ya ___.", ["había empezado", "ha empezado", "empezaba", "empezará"]],
    ["Busco a alguien que ___ hablar japonés.", ["sepa", "sabe", "sabrá", "saber"]],
    // B2
    ["Si lo hubiera sabido, te lo ___.", ["habría dicho", "diría", "había dicho", "dije"]],
    ["Me pidió que le ___ el libro.", ["devolviera", "devuelvo", "devolveré", "he devuelto"]],
    ["Por mucho que ___, no lo conseguirás sin práctica.", ["estudies", "estudias", "estudiarás", "estudiar"]],
    ["La empresa tuvo que ___ a veinte empleados.", ["despedir", "despegar", "despertar", "desplazar"]],
    // C1
    ["De ___ sabido, no habría venido.", ["haberlo", "haberle", "habiéndolo", "lo haber"]],
    ["Tras meses de negociaciones, las conversaciones llegaron a un punto ___.", ["muerto", "final", "cero", "fijo"]],
    ["Lo hizo sin que nadie se ___ cuenta.", ["diera", "dio", "da", "dé"]],
    ["Su argumento carece ___ fundamento.", ["de", "en", "sin", "por"]],
  ],
  en: [
    // A1
    ["She ___ from Armenia.", ["is", "are", "am", "be"]],
    ["___ you like coffee?", ["Do", "Does", "Are", "Is"]],
    ["There ___ two books on the table.", ["are", "is", "be", "am"]],
    ["My birthday is ___ May.", ["in", "on", "at", "to"]],
    // A2
    ["Yesterday I ___ to the cinema.", ["went", "go", "have gone", "going"]],
    ["Have you ever ___ to London?", ["been", "went", "go", "was"]],
    ["This is the ___ film I have ever seen.", ["best", "good", "better", "most good"]],
    ["I was cooking when the phone ___.", ["rang", "was ringing", "rings", "has rung"]],
    // B1
    ["I've lived here ___ 2015.", ["since", "for", "from", "ago"]],
    ["If it rains tomorrow, we ___ at home.", ["will stay", "stayed", "would stay", "stay will"]],
    ["The man ___ lives next door is a doctor.", ["who", "which", "what", "where"]],
    ["I'm looking forward ___ you.", ["to seeing", "to see", "seeing", "see"]],
    // B2
    ["If I had known, I ___ earlier.", ["would have left", "would leave", "had left", "will have left"]],
    ["By this time next year, I ___ my degree.", ["will have finished", "will finish", "am finishing", "finish"]],
    ["She denied ___ the money.", ["taking", "to take", "take", "that took"]],
    ["The concert was ___ because of the storm.", ["called off", "called up", "called out", "called in"]],
    // C1
    ["Little ___ that his life was about to change.", ["did he know", "he knew", "he did know", "knew he"]],
    ["It is essential that every student ___ the form.", ["complete", "completes will", "completing", "to complete"]],
    ["We need to ___ a balance between cost and quality.", ["strike", "hit", "beat", "reach up"]],
    ["The company is on the ___ of bankruptcy.", ["verge", "border", "limit", "edge off"]],
  ],
  fr: [
    // A1
    ["Je ___ étudiant.", ["suis", "es", "est", "ai"]],
    ["Tu ___ quel âge ?", ["as", "es", "a", "ai"]],
    ["Nous habitons ___ Erevan.", ["à", "en", "au", "dans le"]],
    ["J'aime beaucoup ___ chocolat.", ["le", "la", "les", "un"]],
    // A2
    ["Hier, je ___ au cinéma.", ["suis allé", "ai allé", "vais", "irai"]],
    ["Quand j'étais petit, je ___ souvent à la plage.", ["jouais", "ai joué", "joue", "jouerai"]],
    ["Tu veux du pain ? — Oui, j'___ veux bien.", ["en", "y", "le", "lui"]],
    ["C'est le livre ___ je t'ai parlé.", ["dont", "que", "où", "qui"]],
    // B1
    ["Il faut que tu ___ tes devoirs.", ["fasses", "fais", "feras", "faire"]],
    ["Si j'avais de l'argent, j'___ une maison.", ["achèterais", "achète", "achèterai", "achetais"]],
    ["Bien qu'il ___ fatigué, il est venu.", ["soit", "est", "était", "sera"]],
    ["J'habite ici ___ cinq ans.", ["depuis", "pendant", "dans", "pour"]],
    // B2
    ["Si j'avais su, je ___ venu plus tôt.", ["serais", "aurais", "suis", "étais"]],
    ["Les fleurs que j'ai ___ sont belles.", ["achetées", "acheté", "achetés", "achetée"]],
    ["Dès qu'il ___ fini, il partira.", ["aura", "a", "avait", "aurait"]],
    ["Il a beau ___, il ne réussit pas.", ["travailler", "travaille", "travaillé", "travaillant"]],
    // C1
    ["Quel que ___ le prix, je l'achèterai.", ["soit", "est", "sera", "serait"]],
    ["Il est parti sans que personne ne s'en ___ compte.", ["rende", "rend", "rendait", "rendra"]],
    ["Ce débat est totalement ___ de sens.", ["dénué", "dénudé", "dénoué", "déni"]],
    ["Il a agi à l'___ de ses collègues.", ["insu", "ensu", "inçu", "issu"]],
  ],
};

const T = {
  hy: {
    title: (n) => `${n[0]} մակարդակի անվճար թեստ (A1–C1) — Verba School`,
    h1: (n) => `${n[0]} մակարդակի անվճար թեստ`,
    meta: (n) => `Անցեք ${n[1]}ի անվճար առցանց թեստը՝ 20 հարց, մոտ 10 րոպե։ Արդյունքը ցույց կտա ձեր մոտավոր մակարդակը A1-ից մինչև C1։`,
    lede: "20 հարց՝ A1-ից մինչև C1, մոտ 10 րոպե։ Գրանցում պետք չէ։ Վերջում կտեսնեք ձեր մոտավոր մակարդակը։",
    pick: "Ընտրեք ճիշտ պատասխանը", finish: "Տեսնել արդյունքը", missing: (k) => `Պատասխանեք բոլոր հարցերին (մնաց ${k})`,
    result: "Ձեր մոտավոր մակարդակը", score: (a, b) => `${a} ճիշտ պատասխան ${b}-ից`,
    desc: { A1: "Սկսնակ. լավ մեկնարկ է։ Սկսեք A1 դասընթացից։", A2: "Տարրական. հիմքերը կան։ A2 դասընթացը կամրապնդի դրանք։", B1: "Միջին. կարող եք խոսել առօրյա թեմաներով։ B1-ը կազատի ձեր խոսքը։", B2: "Միջինից բարձր. լավ արդյունք է։ B2-ը կդարձնի խոսքը հարուստ ու վստահ։", C1: "Առաջադեմ. գերազանց է։ C1-ում կաշխատենք նրբերանգների վրա։" },
    note: "Սա մոտավոր արդյունք է։ Առաջին դասին ուսուցիչը կճշտի ձեր մակարդակը։",
    cta: "Գրանցվել դասերին", again: "Նորից անցնել", review: "Ճիշտ պատասխանները նշված են կանաչով։",
    other: "Այլ լեզուների թեստեր", course: (n) => `${n[0]} դասեր առցանց`,
  },
  ru: {
    title: (n) => `Бесплатный тест на уровень ${n[0].toLowerCase()} (A1–C1) — Verba School`,
    h1: (n) => `Бесплатный тест на уровень ${n[0].toLowerCase()}`,
    meta: (n) => `Пройдите бесплатный онлайн-тест по ${n[0].toLowerCase().replace(/ого$/, "ому")} языку: 20 вопросов, около 10 минут. Результат покажет примерный уровень от A1 до C1.`,
    lede: "20 вопросов от A1 до C1, около 10 минут. Регистрация не нужна. В конце вы увидите свой примерный уровень.",
    pick: "Выберите правильный ответ", finish: "Узнать результат", missing: (k) => `Ответьте на все вопросы (осталось ${k})`,
    result: "Ваш примерный уровень", score: (a, b) => `${a} правильных ответов из ${b}`,
    desc: { A1: "Начальный — хороший старт. Начните с курса A1.", A2: "Элементарный — основа есть. Курс A2 её закрепит.", B1: "Средний — вы можете говорить на повседневные темы. B1 сделает речь свободнее.", B2: "Выше среднего — отличный результат. B2 сделает речь богатой и уверенной.", C1: "Продвинутый — превосходно. На C1 поработаем над нюансами." },
    note: "Это примерный результат. На первом занятии преподаватель уточнит ваш уровень.",
    cta: "Записаться на занятия", again: "Пройти ещё раз", review: "Правильные ответы отмечены зелёным.",
    other: "Тесты по другим языкам", course: (n) => `Курсы ${n[0].toLowerCase()} онлайн`,
  },
  en: {
    title: (n) => `Free ${n[0]} level test (A1–C1) — Verba School`,
    h1: (n) => `Free ${n[0]} level test`,
    meta: (n) => `Take a free online ${n[0]} level test: 20 questions, about 10 minutes. The result shows your approximate level from A1 to C1.`,
    lede: "20 questions from A1 to C1, about 10 minutes. No sign-up needed. At the end you'll see your approximate level.",
    pick: "Choose the correct answer", finish: "See my result", missing: (k) => `Answer every question (${k} left)`,
    result: "Your approximate level", score: (a, b) => `${a} correct out of ${b}`,
    desc: { A1: "Beginner: a good start. Begin with the A1 course.", A2: "Elementary: you have the basics. The A2 course will strengthen them.", B1: "Intermediate: you can talk about everyday topics. B1 will make you more fluent.", B2: "Upper intermediate: a great result. B2 will make your language rich and confident.", C1: "Advanced: excellent. At C1 we work on nuance." },
    note: "This is an approximate result. Your teacher will confirm your level in the first lesson.",
    cta: "Sign up for lessons", again: "Take it again", review: "Correct answers are marked in green.",
    other: "Tests for other languages", course: (n) => `${n[0]} lessons online`,
  },
};
export const PT = T;
