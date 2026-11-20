// Articles. Each one: title (also <h1>), meta description, short lede, body HTML, date.
// Numbers come from public sources named in the text (Cambridge guided learning hours, US FSI estimates,
// the Organisation internationale de la Francophonie).
export const ARTICLES = {
  polyglot: {
    date: "2026-11-20",
    hy: {
      title: "Ինչպես դառնալ պոլիգլոտ. 8 գործնական խորհուրդ",
      meta: "Ով է պոլիգլոտը, և ինչպես սովորել մի քանի օտար լեզու՝ առանց շփոթվելու։ Գործնական խորհուրդներ հայախոսների համար՝ իսպաներեն, անգլերեն, ֆրանսերեն։",
      lede: "Պոլիգլոտ դառնալու համար հատուկ տաղանդ պետք չէ։ Պետք է ճիշտ հաջորդականություն, ամենօրյա սովորություն և մի քիչ համբերություն։",
      body: `
<h2>Ով է պոլիգլոտը</h2>
<p>«Պոլիգլոտ» բառը հունարեն է՝ <i>poly</i> («շատ») և <i>glōtta</i> («լեզու»)։ Այդպես անվանում են մարդուն, ով ազատ խոսում է մի քանի լեզուներով։ Չկա պաշտոնական սահման, բայց սովորաբար խոսքը չորս և ավելի լեզուների մասին է։</p>
<p>Հայախոսների մեծ մասն արդեն կես ճանապարհին է. շատերը մանկուց գիտեն հայերեն և ռուսերեն, հաճախ նաև անգլերեն։ Ամեն նոր լեզու ավելի հեշտ է տրվում, քանի որ արդեն գիտեք, թե ինչպես է «աշխատում» լեզու սովորելը։</p>
<h2>1. Սկսեք մեկ լեզվից</h2>
<p>Երկու նոր լեզու միաժամանակ սկսելը հաճախ շփոթմունք է առաջացնում, հատկապես եթե դրանք նման են (օրինակ՝ իսպաներեն և իտալերեն)։ Լավ կանոն է՝ հասնել առաջին նոր լեզվով մոտավորապես B1 մակարդակի, հետո նոր սկսել հաջորդը։</p>
<h2>2. Օգտվեք լեզուների «ընտանիքներից»</h2>
<p>Իսպաներեն սովորելուց հետո պորտուգալերենն ու իտալերենը շատ ավելի հեշտ են թվում. բառերի մեծ մասը նման է։ Ֆրանսերենն էլ նույն ռոմանական ընտանիքից է։ Ճիշտ հերթականությունը խնայում է ամիսներ։</p>
<h2>3. Ամեն օր, թեկուզ 20 րոպե</h2>
<p>Կարճ, բայց ամենօրյա պարապմունքներն ավելի արդյունավետ են, քան շաբաթը մեկ անգամ երեք ժամը։ Ուղեղը բառերն ու կառույցները լավագույնս հիշում է կրկնությամբ։</p>
<h2>4. Շատ լսեք</h2>
<p>Լսելը լեզվի հիմքն է։ Սկսեք ձեր մակարդակին համապատասխան ձայնագրություններից՝ սկզբում առանց տեքստի, հետո տեքստով։ Մեր <a href="{{PLATFORM}}">լսողական հարթակը</a> կառուցված է հենց այդ սկզբունքով։</p>
<h2>5. Կրկնեք ժամանակի միջակայքերով</h2>
<p>Նոր բառը կրկնեք մեկ օր, երեք օր, մեկ շաբաթ անց։ Այս մեթոդը (spaced repetition) թույլ է տալիս հիշել բառերը տարիներով։</p>
<h2>6. Խոսեք առաջին իսկ օրվանից</h2>
<p>Սխալվելը սովորելու մաս է։ Որքան շուտ սկսեք խոսել, այնքան արագ կվերանա «լեզվական արգելքը»։</p>
<h2>7. Ունեցեք հստակ նպատակ</h2>
<p>«Սովորել իսպաներեն»-ը չափազանց լայն է։ «Հասնել B1-ի վեց ամսում» կամ «անցնել A2 թեստը»՝ արդեն նպատակ է։ Օգտվեք <a href="{{LEVELS}}">CEFR մակարդակներից</a>՝ առաջընթացը չափելու համար։</p>
<h2>8. Ստուգեք ձեզ</h2>
<p>Պարբերաբար ստուգեք ձեր մակարդակը։ Սկսելու համար անցեք մեր անվճար թեստերից մեկը՝ <a href="{{TEST_es}}">իսպաներեն</a>, <a href="{{TEST_en}}">անգլերեն</a> կամ <a href="{{TEST_fr}}">ֆրանսերեն</a>։</p>
<h2>Ամփոփում</h2>
<p>Պոլիգլոտ դառնալը մարաթոն է, ոչ թե սպրինտ։ Մեկ լեզու, ամենօրյա սովորություն, շատ լսել և խոսել։ Verba School-ում դասավանդում ենք իսպաներեն, անգլերեն և ֆրանսերեն՝ բացատրությունները հայերենով։</p>`,
    },
    ru: {
      title: "Как стать полиглотом: 8 практических советов",
      meta: "Кто такой полиглот и как выучить несколько иностранных языков, не путаясь. Практические советы для армяноязычных: испанский, английский, французский.",
      lede: "Чтобы стать полиглотом, особый талант не нужен. Нужны правильная очерёдность, ежедневная привычка и немного терпения.",
      body: `
<h2>Кто такой полиглот</h2>
<p>Слово «полиглот» греческое: <i>poly</i> («много») и <i>glōtta</i> («язык»). Так называют человека, свободно говорящего на нескольких языках. Официальной границы нет, но обычно речь идёт о четырёх языках и больше.</p>
<p>Многие в Армении уже на полпути: с детства знают армянский и русский, часто ещё и английский. Каждый следующий язык даётся легче, потому что вы уже знаете, как «работает» изучение языка.</p>
<h2>1. Начните с одного языка</h2>
<p>Два новых языка одновременно часто путаются, особенно похожие (например, испанский и итальянский). Хорошее правило — довести первый новый язык примерно до уровня B1 и только потом браться за следующий.</p>
<h2>2. Используйте языковые «семьи»</h2>
<p>После испанского португальский и итальянский кажутся намного проще: большая часть слов похожа. Французский — из той же романской семьи. Правильный порядок экономит месяцы.</p>
<h2>3. Каждый день, хотя бы 20 минут</h2>
<p>Короткие ежедневные занятия эффективнее, чем три часа раз в неделю. Мозг лучше всего запоминает слова и конструкции через повторение.</p>
<h2>4. Много слушайте</h2>
<p>Аудирование — основа языка. Начните с записей своего уровня: сначала без текста, потом с текстом. Наша <a href="{{PLATFORM}}">платформа для аудирования</a> построена именно так.</p>
<h2>5. Повторяйте с интервалами</h2>
<p>Повторите новое слово через день, через три дня, через неделю. Этот метод (интервальное повторение) помогает помнить слова годами.</p>
<h2>6. Говорите с первого дня</h2>
<p>Ошибки — часть обучения. Чем раньше вы начнёте говорить, тем быстрее исчезнет «языковой барьер».</p>
<h2>7. Поставьте чёткую цель</h2>
<p>«Выучить испанский» — слишком широко. «Дойти до B1 за полгода» или «сдать тест A2» — уже цель. Используйте <a href="{{LEVELS}}">уровни CEFR</a>, чтобы измерять прогресс.</p>
<h2>8. Проверяйте себя</h2>
<p>Регулярно проверяйте свой уровень. Для начала пройдите один из наших бесплатных тестов: <a href="{{TEST_es}}">испанский</a>, <a href="{{TEST_en}}">английский</a> или <a href="{{TEST_fr}}">французский</a>.</p>
<h2>Итог</h2>
<p>Стать полиглотом — это марафон, а не спринт. Один язык за раз, ежедневная привычка, много слушать и говорить. В Verba School мы преподаём испанский, английский и французский с объяснениями на армянском.</p>`,
    },
    en: {
      title: "How to become a polyglot: 8 practical tips",
      meta: "What a polyglot is and how to learn several foreign languages without mixing them up. Practical tips for Armenian speakers learning Spanish, English and French.",
      lede: "You don't need a special talent to become a polyglot. You need the right order, a daily habit and a bit of patience.",
      body: `
<h2>What is a polyglot?</h2>
<p>"Polyglot" comes from Greek: <i>poly</i> ("many") and <i>glōtta</i> ("tongue, language"). It means someone who speaks several languages well. There's no official threshold, but people usually mean four languages or more.</p>
<p>Many people in Armenia are already halfway there: they grow up with Armenian and Russian, and often English too. Every new language gets easier, because you already know how learning a language works.</p>
<h2>1. Start with one language</h2>
<p>Starting two new languages at once often leads to mix-ups, especially similar ones like Spanish and Italian. A good rule is to bring your first new language to about B1 before starting the next.</p>
<h2>2. Use language families</h2>
<p>After Spanish, Portuguese and Italian feel much easier because so many words are similar. French belongs to the same Romance family. The right order saves months.</p>
<h2>3. Every day, even 20 minutes</h2>
<p>Short daily sessions beat three hours once a week. Your brain remembers words and structures best through repetition.</p>
<h2>4. Listen a lot</h2>
<p>Listening is the foundation. Start with recordings at your level: first without the text, then with it. Our <a href="{{PLATFORM}}">listening platform</a> is built exactly this way.</p>
<h2>5. Review at intervals</h2>
<p>Review a new word after a day, three days, then a week. This method (spaced repetition) helps you keep words for years.</p>
<h2>6. Speak from day one</h2>
<p>Mistakes are part of learning. The sooner you start speaking, the sooner the "language barrier" disappears.</p>
<h2>7. Set a clear goal</h2>
<p>"Learn Spanish" is too vague. "Reach B1 in six months" or "pass the A2 test" is a goal. Use the <a href="{{LEVELS}}">CEFR levels</a> to measure your progress.</p>
<h2>8. Test yourself</h2>
<p>Check your level regularly. To begin, take one of our free tests: <a href="{{TEST_es}}">Spanish</a>, <a href="{{TEST_en}}">English</a> or <a href="{{TEST_fr}}">French</a>.</p>
<h2>In short</h2>
<p>Becoming a polyglot is a marathon, not a sprint: one language at a time, a daily habit, lots of listening and speaking. At Verba School we teach Spanish, English and French with explanations in Armenian.</p>`,
    },
  },

  levels: {
    date: "2026-11-20",
    hy: {
      title: "Ի՞նչ են նշանակում A1, A2, B1, B2, C1, C2 մակարդակները",
      meta: "Լեզվի իմացության եվրոպական մակարդակները (CEFR)՝ պարզ բացատրությամբ։ Ինչ կարող եք անել A1-ից մինչև C2 յուրաքանչյուր մակարդակում։",
      lede: "Լեզվի իմացության մակարդակները սահմանված են Լեզուների իմացության ընդհանուր եվրոպական շրջանակում (CEFR)։ Այն օգտագործվում է ամբողջ աշխարհում՝ դասընթացներում, քննություններում և աշխատանքի ընդունելիս։",
      body: `
<h2>Երեք խումբ, վեց մակարդակ</h2>
<p>CEFR-ը մակարդակները բաժանում է երեք խմբի՝ <b>A</b> (հիմնային օգտագործող), <b>B</b> (ինքնուրույն օգտագործող) և <b>C</b> (հմուտ օգտագործող)։ Յուրաքանչյուր խումբ ունի երկու մակարդակ։</p>
<table class="ltable"><thead><tr><th>Մակարդակ</th><th>Ինչ կարող եք անել</th></tr></thead><tbody>
<tr><td><b>A1</b> Սկսնակ</td><td>Ներկայանալ, հարցնել և պատասխանել պարզ հարցերի, հասկանալ ծանոթ բառեր և շատ պարզ նախադասություններ։</td></tr>
<tr><td><b>A2</b> Տարրական</td><td>Խոսել ձեր, ընտանիքի, աշխատանքի մասին, գնումներ անել, պատմել անցյալի մասին պարզ նախադասություններով։</td></tr>
<tr><td><b>B1</b> Միջին</td><td>Ճամփորդելիս հաղթահարել իրավիճակների մեծ մասը, պատմել փորձառության, ծրագրերի մասին, հիմնավորել կարծիքը։</td></tr>
<tr><td><b>B2</b> Միջինից բարձր</td><td>Ազատ խոսել մայրենի խոսողի հետ, հասկանալ բարդ տեքստերի հիմնական գաղափարը, բանավիճել։</td></tr>
<tr><td><b>C1</b> Առաջադեմ</td><td>Հասկանալ երկար ու բարդ տեքստեր, խոսել սահուն և ճկուն՝ աշխատանքի ու ուսման մեջ։</td></tr>
<tr><td><b>C2</b> Տիրապետում</td><td>Հասկանալ գրեթե ամեն ինչ, արտահայտվել ճշգրիտ և նրբերանգներով՝ ցանկացած թեմայով։</td></tr>
</tbody></table>
<h2>Ո՞ր մակարդակն է պետք ինձ</h2>
<ul>
<li><b>Ճամփորդության համար</b>՝ A2–B1 բավական է։</li>
<li><b>Աշխատանքի համար</b>՝ սովորաբար պահանջվում է B2։</li>
<li><b>Արտասահմանում սովորելու համար</b>՝ հաճախ B2 կամ C1։</li>
</ul>
<h2>Որքա՞ն ժամանակ է պետք յուրաքանչյուր մակարդակի համար</h2>
<p>Կախված է լեզվից և պարապմունքների հաճախականությունից։ Մանրամասն կարդացեք <a href="{{HOWLONG}}">այս հոդվածում</a>։</p>
<h2>Իմացեք ձեր մակարդակը</h2>
<p>Անցեք մեր անվճար թեստը՝ <a href="{{TEST_es}}">իսպաներեն</a>, <a href="{{TEST_en}}">անգլերեն</a> կամ <a href="{{TEST_fr}}">ֆրանսերեն</a>։ Verba School-ում դասընթացները կառուցված են հենց այս մակարդակներով՝ A1-ից մինչև C1, և յուրաքանչյուր մակարդակի վերջում կա թեստ։</p>`,
    },
    ru: {
      title: "Что означают уровни A1, A2, B1, B2, C1, C2",
      meta: "Европейские уровни владения языком (CEFR) простыми словами: что вы умеете на каждом уровне от A1 до C2.",
      lede: "Уровни владения языком описаны в Общеевропейских компетенциях владения иностранным языком (CEFR). Их используют по всему миру — на курсах, экзаменах и при приёме на работу.",
      body: `
<h2>Три группы, шесть уровней</h2>
<p>CEFR делит уровни на три группы: <b>A</b> (базовое владение), <b>B</b> (самостоятельное владение) и <b>C</b> (свободное владение). В каждой группе два уровня.</p>
<table class="ltable"><thead><tr><th>Уровень</th><th>Что вы умеете</th></tr></thead><tbody>
<tr><td><b>A1</b> Начальный</td><td>Представиться, задавать и отвечать на простые вопросы, понимать знакомые слова и очень простые фразы.</td></tr>
<tr><td><b>A2</b> Элементарный</td><td>Рассказать о себе, семье, работе, делать покупки, говорить о прошлом простыми фразами.</td></tr>
<tr><td><b>B1</b> Средний</td><td>Справляться с большинством ситуаций в поездке, рассказывать об опыте и планах, объяснять своё мнение.</td></tr>
<tr><td><b>B2</b> Выше среднего</td><td>Свободно общаться с носителем, понимать главную мысль сложных текстов, вести дискуссию.</td></tr>
<tr><td><b>C1</b> Продвинутый</td><td>Понимать длинные и сложные тексты, говорить бегло и гибко в работе и учёбе.</td></tr>
<tr><td><b>C2</b> В совершенстве</td><td>Понимать практически всё, выражаться точно и с нюансами на любую тему.</td></tr>
</tbody></table>
<h2>Какой уровень нужен мне?</h2>
<ul>
<li><b>Для путешествий</b> достаточно A2–B1.</li>
<li><b>Для работы</b> обычно требуется B2.</li>
<li><b>Для учёбы за рубежом</b> часто нужен B2 или C1.</li>
</ul>
<h2>Сколько времени нужно на каждый уровень?</h2>
<p>Зависит от языка и частоты занятий. Подробно — <a href="{{HOWLONG}}">в этой статье</a>.</p>
<h2>Узнайте свой уровень</h2>
<p>Пройдите наш бесплатный тест: <a href="{{TEST_es}}">испанский</a>, <a href="{{TEST_en}}">английский</a> или <a href="{{TEST_fr}}">французский</a>. В Verba School курсы построены по этим уровням — от A1 до C1, и в конце каждого уровня есть тест.</p>`,
    },
    en: {
      title: "What do the A1, A2, B1, B2, C1 and C2 levels mean?",
      meta: "The European language levels (CEFR) explained simply: what you can do at each level from A1 to C2.",
      lede: "Language levels are defined by the Common European Framework of Reference for Languages (CEFR). It's used worldwide, in courses, exams and hiring.",
      body: `
<h2>Three groups, six levels</h2>
<p>The CEFR splits levels into three groups: <b>A</b> (basic user), <b>B</b> (independent user) and <b>C</b> (proficient user). Each group has two levels.</p>
<table class="ltable"><thead><tr><th>Level</th><th>What you can do</th></tr></thead><tbody>
<tr><td><b>A1</b> Beginner</td><td>Introduce yourself, ask and answer simple questions, understand familiar words and very simple sentences.</td></tr>
<tr><td><b>A2</b> Elementary</td><td>Talk about yourself, your family and work, go shopping, describe the past in simple sentences.</td></tr>
<tr><td><b>B1</b> Intermediate</td><td>Handle most situations when travelling, describe experiences and plans, explain your opinion.</td></tr>
<tr><td><b>B2</b> Upper intermediate</td><td>Talk easily with native speakers, understand the main ideas of complex texts, debate.</td></tr>
<tr><td><b>C1</b> Advanced</td><td>Understand long, demanding texts and speak fluently and flexibly at work and in study.</td></tr>
<tr><td><b>C2</b> Mastery</td><td>Understand almost everything and express yourself precisely, with nuance, on any topic.</td></tr>
</tbody></table>
<h2>Which level do I need?</h2>
<ul>
<li><b>For travel</b>, A2–B1 is enough.</li>
<li><b>For work</b>, B2 is usually expected.</li>
<li><b>For study abroad</b>, often B2 or C1.</li>
</ul>
<h2>How long does each level take?</h2>
<p>It depends on the language and how often you study. Read more <a href="{{HOWLONG}}">in this article</a>.</p>
<h2>Find your level</h2>
<p>Take our free test in <a href="{{TEST_es}}">Spanish</a>, <a href="{{TEST_en}}">English</a> or <a href="{{TEST_fr}}">French</a>. At Verba School, courses follow these levels from A1 to C1, with a test at the end of each level.</p>`,
    },
  },

  howlong: {
    date: "2026-11-20",
    hy: {
      title: "Որքա՞ն ժամանակ է պետք օտար լեզու սովորելու համար",
      meta: "Քանի ժամ է պետք A2, B1, B2 կամ C1 մակարդակի հասնելու համար։ Իրատեսական թվեր իսպաներենի, անգլերենի և ֆրանսերենի համար և ինչպես արագացնել գործընթացը։",
      lede: "Ամենահաճախ տրվող հարցն է։ Ճշգրիտ պատասխան չկա, բայց կան իրատեսական թվեր, որոնք կօգնեն պլանավորել։",
      body: `
<h2>Ժամերն ըստ մակարդակի</h2>
<p>Cambridge-ի գնահատմամբ՝ ուսուցչի հետ պարապմունքների (guided learning) մոտավոր ընդհանուր ժամերը զրոյից սկսած այսպիսին են.</p>
<table class="ltable"><thead><tr><th>Մակարդակ</th><th>Մոտավոր ժամեր</th></tr></thead><tbody>
<tr><td><b>A2</b></td><td>180–200</td></tr>
<tr><td><b>B1</b></td><td>350–400</td></tr>
<tr><td><b>B2</b></td><td>500–600</td></tr>
<tr><td><b>C1</b></td><td>700–800</td></tr>
<tr><td><b>C2</b></td><td>1000–1200</td></tr>
</tbody></table>
<p>Սա միջին ցուցանիշ է։ Ինքնուրույն աշխատանքը (լսել, կարդալ, կրկնել) կարող է զգալիորեն արագացնել առաջընթացը։</p>
<h2>Իսկ ամիսներո՞վ</h2>
<p>Եթե պարապում եք շաբաթական 3 ժամ դասով և 2–3 ժամ ինքնուրույն, A2-ին կարելի է հասնել մոտ 6–8 ամսում, B1-ին՝ մոտ մեկ տարում։ Ամենօրյա կարճ պարապմունքներն ավելի արդյունավետ են, քան հազվադեպ երկար դասերը։</p>
<h2>Ո՞ր լեզուն է ավելի արագ</h2>
<p>ԱՄՆ-ի Արտաքին ծառայության ինստիտուտը (FSI) իսպաներենն ու ֆրանսերենը դասում է անգլիախոսների համար ամենահեշտ լեզուների շարքում՝ մոտ 24–30 շաբաթ ինտենսիվ դասընթաց։ Հայախոսների համար պատկերը մի փոքր այլ է, բայց իսպաներենի արտասանությունը սովորաբար ավելի հեշտ է թվում, քան ֆրանսերենինը։ Համեմատությունը կարդացեք <a href="{{ESFR}}">այստեղ</a>։</p>
<h2>Ինչպես արագացնել</h2>
<ul>
<li>Պարապեք ամեն օր, թեկուզ 20 րոպե։</li>
<li>Լսեք ձեր մակարդակին համապատասխան ձայնագրություններ։</li>
<li>Խոսեք առաջին իսկ շաբաթվանից։</li>
<li>Պարբերաբար ստուգեք մակարդակը թեստով։</li>
</ul>
<p>Սկսեք նրանից, որ իմանաք ձեր ներկայիս մակարդակը՝ անվճար թեստ <a href="{{TEST_es}}">իսպաներենի</a>, <a href="{{TEST_en}}">անգլերենի</a> կամ <a href="{{TEST_fr}}">ֆրանսերենի</a>։</p>`,
    },
    ru: {
      title: "Сколько времени нужно, чтобы выучить иностранный язык",
      meta: "Сколько часов нужно, чтобы дойти до уровня A2, B1, B2 или C1. Реалистичные цифры для испанского, английского и французского и как ускорить процесс.",
      lede: "Самый частый вопрос. Точного ответа нет, но есть реалистичные цифры, которые помогут спланировать обучение.",
      body: `
<h2>Часы по уровням</h2>
<p>По оценке Cambridge, примерное общее число часов занятий с преподавателем (guided learning) с нуля такое:</p>
<table class="ltable"><thead><tr><th>Уровень</th><th>Примерно часов</th></tr></thead><tbody>
<tr><td><b>A2</b></td><td>180–200</td></tr>
<tr><td><b>B1</b></td><td>350–400</td></tr>
<tr><td><b>B2</b></td><td>500–600</td></tr>
<tr><td><b>C1</b></td><td>700–800</td></tr>
<tr><td><b>C2</b></td><td>1000–1200</td></tr>
</tbody></table>
<p>Это средние цифры. Самостоятельная работа (слушать, читать, повторять) может заметно ускорить прогресс.</p>
<h2>А в месяцах?</h2>
<p>Если заниматься 3 часа в неделю с преподавателем и 2–3 часа самостоятельно, до A2 можно дойти примерно за 6–8 месяцев, до B1 — примерно за год. Короткие ежедневные занятия эффективнее редких длинных.</p>
<h2>Какой язык быстрее?</h2>
<p>Институт дипломатической службы США (FSI) относит испанский и французский к самым лёгким языкам для англоговорящих — около 24–30 недель интенсивного курса. Для армяноязычных картина немного другая, но испанское произношение обычно даётся легче французского. Сравнение — <a href="{{ESFR}}">здесь</a>.</p>
<h2>Как ускорить</h2>
<ul>
<li>Занимайтесь каждый день, хотя бы 20 минут.</li>
<li>Слушайте записи своего уровня.</li>
<li>Начинайте говорить с первой недели.</li>
<li>Регулярно проверяйте уровень тестом.</li>
</ul>
<p>Начните с того, чтобы узнать свой текущий уровень: бесплатный тест по <a href="{{TEST_es}}">испанскому</a>, <a href="{{TEST_en}}">английскому</a> или <a href="{{TEST_fr}}">французскому</a>.</p>`,
    },
    en: {
      title: "How long does it take to learn a foreign language?",
      meta: "How many hours it takes to reach A2, B1, B2 or C1. Realistic numbers for Spanish, English and French, and how to speed things up.",
      lede: "It's the most common question. There's no exact answer, but there are realistic numbers to help you plan.",
      body: `
<h2>Hours per level</h2>
<p>Cambridge estimates these approximate total guided learning hours, starting from zero:</p>
<table class="ltable"><thead><tr><th>Level</th><th>Approximate hours</th></tr></thead><tbody>
<tr><td><b>A2</b></td><td>180–200</td></tr>
<tr><td><b>B1</b></td><td>350–400</td></tr>
<tr><td><b>B2</b></td><td>500–600</td></tr>
<tr><td><b>C1</b></td><td>700–800</td></tr>
<tr><td><b>C2</b></td><td>1000–1200</td></tr>
</tbody></table>
<p>These are averages. Independent work (listening, reading, reviewing) can speed things up a lot.</p>
<h2>And in months?</h2>
<p>With 3 hours of lessons a week plus 2–3 hours on your own, you can reach A2 in roughly 6–8 months and B1 in about a year. Short daily practice beats rare long sessions.</p>
<h2>Which language is faster?</h2>
<p>The US Foreign Service Institute (FSI) puts Spanish and French among the easiest languages for English speakers, at about 24–30 weeks of intensive study. For Armenian speakers the picture is a bit different, but Spanish pronunciation usually feels easier than French. See the comparison <a href="{{ESFR}}">here</a>.</p>
<h2>How to go faster</h2>
<ul>
<li>Practise every day, even for 20 minutes.</li>
<li>Listen to recordings at your level.</li>
<li>Start speaking in the first week.</li>
<li>Check your level regularly with a test.</li>
</ul>
<p>Start by finding your current level with a free test in <a href="{{TEST_es}}">Spanish</a>, <a href="{{TEST_en}}">English</a> or <a href="{{TEST_fr}}">French</a>.</p>`,
    },
  },

  esfr: {
    date: "2026-11-20",
    hy: {
      title: "Իսպաներեն, թե ֆրանսերեն. ո՞րն ընտրել հայախոսին",
      meta: "Իսպաներենի և ֆրանսերենի համեմատություն՝ արտասանություն, քերականություն, ուղղագրություն, որտեղ են խոսում և ո՞րն է ավելի հեշտ հայախոսի համար։",
      lede: "Երկուսն էլ գեղեցիկ ռոմանական լեզուներ են՝ ընդհանուր արմատներով։ Բայց սովորելու փորձառությունը տարբեր է։",
      body: `
<h2>Արտասանություն և ուղղագրություն</h2>
<p><b>Իսպաներենը</b> հիմնականում կարդացվում է այնպես, ինչպես գրվում է։ Ձայնավորները քիչ են (հինգ հիմնական), և դրանք հնչում են հստակ։ Հայախոսների համար այս արտասանությունը սովորաբար հեշտ է։</p>
<p><b>Ֆրանսերենում</b> շատ տառեր չեն արտասանվում (օրինակ՝ բառավերջի բաղաձայները), կան քթային ձայնավորներ և ավելի շատ ձայնավոր հնչյուններ։ Սկզբում ավելի դժվար է լսելով հասկանալ և ճիշտ կարդալ։</p>
<h2>Քերականություն</h2>
<p>Երկու լեզուներում էլ գոյականներն ունեն սեռ (արական/իգական), բայերը խոնարհվում են ըստ դեմքի, և կա ըղձական եղանակ (subjuntivo / subjonctif)։ Իսպաներենում բայական ձևերն ավելի շատ են օգտագործվում խոսքում, իսկ ֆրանսերենում ավելի դժվար է ճիշտ գրելը։</p>
<h2>Որտեղ են խոսում</h2>
<ul>
<li><b>Իսպաներեն</b>՝ պաշտոնական լեզու մոտ 20 երկրում (Իսպանիա և Լատինական Ամերիկայի մեծ մասը), մոտ 500 միլիոն մայրենի խոսող։</li>
<li><b>Ֆրանսերեն</b>՝ պաշտոնական լեզու մոտ 29 երկրում Եվրոպայում, Աֆրիկայում և Ամերիկայում, ավելի քան 300 միլիոն խոսող։ Հայաստանը Ֆրանկոֆոնիայի միջազգային կազմակերպության լիիրավ անդամ է, իսկ Երևանը 2018-ին հյուրընկալել է Ֆրանկոֆոնիայի գագաթնաժողովը։</li>
</ul>
<h2>Ո՞րն ընտրել</h2>
<ul>
<li>Ուզում եք <b>արագ սկսել խոսել</b> և ճամփորդել Իսպանիայում ու Լատինական Ամերիկայում՝ <b>իսպաներեն</b>։</li>
<li>Ձեզ հետաքրքրում է <b>ուսումը Ֆրանսիայում, Բելգիայում, Կանադայում</b>, միջազգային կազմակերպությունները կամ ֆրանսիական մշակույթը՝ <b>ֆրանսերեն</b>։</li>
<li>Չեք կարողանում որոշել՝ ընտրեք այն, որն ավելի շատ է ձեզ <b>դուր գալիս</b>։ Մոտիվացիան ամենակարևոր գործոնն է։</li>
</ul>
<p>Իսկ եթե մեկը սովորեք, մյուսը շատ ավելի հեշտ կլինի. դրանք նույն ընտանիքից են։ Ավելին՝ <a href="{{POLYGLOT}}">ինչպես դառնալ պոլիգլոտ</a>։</p>
<h2>Փորձեք երկուսն էլ</h2>
<p>Լսեք իրական դասերի հատվածներ մեր էջերում՝ <a href="{{COURSE_es}}">իսպաներենի դասեր</a> և <a href="{{COURSE_fr}}">ֆրանսերենի դասեր</a>, կամ անցեք անվճար թեստ՝ <a href="{{TEST_es}}">իսպաներեն</a>, <a href="{{TEST_fr}}">ֆրանսերեն</a>։</p>`,
    },
    ru: {
      title: "Испанский или французский: что выбрать?",
      meta: "Сравнение испанского и французского: произношение, грамматика, орфография, где говорят и какой язык проще для армяноязычных.",
      lede: "Оба — красивые романские языки с общими корнями. Но опыт изучения у них разный.",
      body: `
<h2>Произношение и орфография</h2>
<p><b>Испанский</b> в основном читается так, как пишется. Гласных немного (пять основных), и они звучат чётко. Для армяноязычных такое произношение обычно даётся легко.</p>
<p>Во <b>французском</b> многие буквы не произносятся (например, согласные на конце слов), есть носовые гласные и больше гласных звуков. Поначалу труднее понимать на слух и правильно читать.</p>
<h2>Грамматика</h2>
<p>В обоих языках у существительных есть род, глаголы спрягаются по лицам, есть сослагательное наклонение (subjuntivo / subjonctif). В испанском больше глагольных форм используется в речи, а во французском сложнее грамотно писать.</p>
<h2>Где говорят</h2>
<ul>
<li><b>Испанский</b> — официальный язык примерно 20 стран (Испания и большая часть Латинской Америки), около 500 миллионов носителей.</li>
<li><b>Французский</b> — официальный язык примерно 29 стран в Европе, Африке и Америке, более 300 миллионов говорящих. Армения — полноправный член Международной организации франкофонии, а в 2018 году Ереван принимал саммит Франкофонии.</li>
</ul>
<h2>Что выбрать?</h2>
<ul>
<li>Хотите <b>быстрее заговорить</b> и путешествовать по Испании и Латинской Америке — <b>испанский</b>.</li>
<li>Интересует <b>учёба во Франции, Бельгии, Канаде</b>, международные организации или французская культура — <b>французский</b>.</li>
<li>Не можете решить — выберите тот, который вам <b>больше нравится</b>. Мотивация — главный фактор.</li>
</ul>
<p>А выучив один, второй дастся гораздо легче: они из одной семьи. Подробнее — <a href="{{POLYGLOT}}">как стать полиглотом</a>.</p>
<h2>Попробуйте оба</h2>
<p>Послушайте фрагменты настоящих уроков на наших страницах — <a href="{{COURSE_es}}">курсы испанского</a> и <a href="{{COURSE_fr}}">курсы французского</a> — или пройдите бесплатный тест: <a href="{{TEST_es}}">испанский</a>, <a href="{{TEST_fr}}">французский</a>.</p>`,
    },
    en: {
      title: "Spanish or French: which should you choose?",
      meta: "Spanish vs French: pronunciation, grammar, spelling, where they're spoken and which is easier for Armenian speakers.",
      lede: "Both are beautiful Romance languages with shared roots, but learning them feels quite different.",
      body: `
<h2>Pronunciation and spelling</h2>
<p><b>Spanish</b> is mostly read the way it's written. It has few vowels (five main ones), and they sound clear. Armenian speakers usually find this pronunciation easy.</p>
<p><b>French</b> has many silent letters (such as final consonants), nasal vowels and more vowel sounds. At first it's harder to understand by ear and to read aloud correctly.</p>
<h2>Grammar</h2>
<p>In both languages nouns have gender, verbs change with the person, and there's a subjunctive mood (subjuntivo / subjonctif). Spanish uses more verb forms in everyday speech, while French is harder to spell correctly.</p>
<h2>Where they're spoken</h2>
<ul>
<li><b>Spanish</b>: an official language in about 20 countries (Spain and most of Latin America), with about 500 million native speakers.</li>
<li><b>French</b>: an official language in about 29 countries across Europe, Africa and the Americas, with more than 300 million speakers. Armenia is a full member of the International Organisation of La Francophonie, and Yerevan hosted the Francophonie Summit in 2018.</li>
</ul>
<h2>Which to choose</h2>
<ul>
<li>Want to <b>start speaking quickly</b> and travel in Spain and Latin America? <b>Spanish</b>.</li>
<li>Interested in <b>studying in France, Belgium or Canada</b>, international organisations or French culture? <b>French</b>.</li>
<li>Can't decide? Pick the one you <b>like more</b>. Motivation matters most.</li>
</ul>
<p>Once you learn one, the other gets much easier: they're from the same family. More on that in <a href="{{POLYGLOT}}">how to become a polyglot</a>.</p>
<h2>Try both</h2>
<p>Listen to excerpts of real lessons on our pages for <a href="{{COURSE_es}}">Spanish lessons</a> and <a href="{{COURSE_fr}}">French lessons</a>, or take a free test in <a href="{{TEST_es}}">Spanish</a> or <a href="{{TEST_fr}}">French</a>.</p>`,
    },
  },
};

export const BLOG_T = {
  hy: { title: "Բլոգ — լեզուներ սովորելու մասին | Verba School", h1: "Բլոգ", meta: "Հոդվածներ օտար լեզուներ սովորելու մասին՝ իսպաներեն, անգլերեն, ֆրանսերեն, CEFR մակարդակներ, պոլիգլոտ դառնալու խորհուրդներ։", lede: "Խորհուրդներ և բացատրություններ նրանց համար, ովքեր սովորում են իսպաներեն, անգլերեն կամ ֆրանսերեն։", read: "Կարդալ", crumb: "Բլոգ" },
  ru: { title: "Блог — об изучении языков | Verba School", h1: "Блог", meta: "Статьи об изучении иностранных языков: испанский, английский, французский, уровни CEFR, советы полиглотов.", lede: "Советы и объяснения для тех, кто учит испанский, английский или французский.", read: "Читать", crumb: "Блог" },
  en: { title: "Blog — learning languages | Verba School", h1: "Blog", meta: "Articles about learning foreign languages: Spanish, English, French, CEFR levels and tips for becoming a polyglot.", lede: "Tips and explanations for anyone learning Spanish, English or French.", read: "Read", crumb: "Blog" },
};
