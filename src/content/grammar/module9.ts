import type { GrammarTopic } from '../../types';

/** Modul 9 — B2: kesim tizimi, passiv, sonlar turlanishi, aspekt nozikliklari, kitobiy predloglar */
export const MODULE_9: GrammarTopic[] = [
  {
    id: 'm9-participles-full',
    module: 9,
    order: 1,
    level: 'B2',
    title: "To'liq kesim tizimi",
    subtitle: 'читающий, читавший, читаемый, прочитанный',
    theory: [
      {
        heading: "4 xil kesim",
        body: "Rus tilida 4 turdagi kesim bor: faol hozirgi (-ущ/-ющ/-ащ/-ящ), faol o'tgan (-вш/-ш), majhul hozirgi (-ем/-им), majhul o'tgan (-нн/-енн/-т). Hammasi sifatdek turlanadi.",
        table: [
          ['Turi', 'Yasalishi', 'Misol', "Ma'no"],
          ['Faol hozirgi', '-ющ-', 'чита́ющий', "o'qiyotgan"],
          ["Faol o'tgan", '-вш-', 'чита́вший', "o'qigan (o'zi)"],
          ['Majhul hozirgi', '-ем-', 'чита́емый', "o'qilayotgan"],
          ["Majhul o'tgan", '-нн-', 'прочи́танный', "o'qilgan"],
        ],
      },
      {
        heading: 'Kesim oborotlari',
        body: "Kesimli birikma otdan keyin kelsa vergul bilan ajratiladi: Книга, прочитанная мной вчера, очень интересная. Otdan oldin kelsa vergulsiz: прочитанная мной книга.",
      },
      {
        heading: "Og'zaki muqobil",
        body: "Og'zaki nutqda kesim o'rniga который ishlatiladi: студент, изучающий русский = студент, который изучает русский. Kesim — yozma va rasmiy uslub belgisi.",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha '-ayotgan' (faol hozirgi) = -ющий, '-gan' (faol o'tgan) = -вший, '-layotgan/-ilayotgan' = -емый, '-ilgan' = -нный. O'zbek tilida bu shakllar juda faol — ruschada esa asosan yozma nutqda.",
    examples: [
      { ru: 'студе́нт, изуча́ющий ру́сский язы́к', uz: "rus tilini o'rganayotgan talaba" },
      { ru: 'писа́тель, написа́вший э́тот рома́н', uz: 'bu romanni yozgan yozuvchi' },
      { ru: 'пробле́ма, обсужда́емая на конфере́нции', uz: 'konferensiyada muhokama qilinayotgan muammo' },
      { ru: 'пи́сьма, напи́санные в про́шлом ве́ке', uz: "o'tgan asrda yozilgan xatlar" },
      { ru: 'Челове́к, сде́лавший э́то, геро́й.', uz: 'Buni qilgan odam — qahramon.' },
    ],
    commonMistakes: [
      { wrong: 'студент, который изучающий', right: 'студент, изучающий / студент, который изучает', why_uz: 'который va kesim birga kelmaydi — bittasini tanlang.' },
      { wrong: 'прочитанная книга мной', right: 'прочитанная мной книга', why_uz: "Bajaruvchi (Т.п) kesimdan keyin, otdan oldin turadi." },
      { wrong: 'написавшая письмо (xat haqida)', right: 'написанное письмо', why_uz: 'Xat YOZILGAN (majhul), yozuvchi YOZGAN (faol) — yo‘nalishni adashtirmang.' },
    ],
    exercises: [
      { id: 'm9-part-1', type: 'choose', prompt: "«o'qiyotgan talaba» qanday?", answer: 'читающий студент', choices: ['читающий студент', 'читавший студент', 'читаемый студент', 'прочитанный студент'], explanation_uz: 'Faol hozirgi: -ющий.' },
      { id: 'm9-part-2', type: 'choose', prompt: '«yozilgan xat» qanday?', answer: 'написанное письмо', choices: ['написанное письмо', 'написавшее письмо', 'пишущее письмо', 'писавшее письмо'], explanation_uz: "Majhul o'tgan: -нное." },
      { id: 'm9-part-3', type: 'transform', prompt: 'который bilan almashtiring: «человек, сделавший это»', answer: 'человек, который сделал это', explanation_uz: 'Faol kesim → который + fe’l.' },
      { id: 'm9-part-4', type: 'choose', prompt: '«обсуждаемый вопрос» nimani bildiradi?', answer: 'muhokama qilinayotgan masala', choices: ['muhokama qilinayotgan masala', 'muhokama qilgan masala', 'muhokama qilinadigan edi', 'muhokama tugagan masala'], explanation_uz: 'Majhul hozirgi -емый.' },
      { id: 'm9-part-5', type: 'fillBlank', prompt: 'Книга, прочитанн___ мной вчера, интересная.', answer: 'ая', explanation_uz: 'книга ж → прочитанная.' },
      { id: 'm9-part-6', type: 'errorHunt', prompt: 'Xatoni toping: «девушка, которая поющая на сцене»', answer: 'девушка, поющая на сцене', explanation_uz: 'которая ortiqcha — kesimning o‘zi yetadi.' },
      { id: 'm9-part-7', type: 'transform', prompt: 'Kesim bilan qisqartiring: «студенты, которые изучают русский»', answer: 'студенты, изучающие русский', explanation_uz: 'изучающие — faol hozirgi ko‘plik.' },
      { id: 'm9-part-8', type: 'choose', prompt: 'Qaysi kesim YOZMA uslubga xos?', answer: 'hammasi — kesim kitobiy shakl', choices: ['hammasi — kesim kitobiy shakl', 'faqat -ющий', 'faqat -нный', 'hech qaysi'], explanation_uz: "Og'zaki nutqda который afzal." },
    ],
  },
  {
    id: 'm9-passive',
    module: 9,
    order: 2,
    level: 'B2',
    title: 'Passiv konstruksiyalar',
    subtitle: 'Дом строится. Дом построен.',
    theory: [
      {
        heading: 'НСВ passiv: -ся',
        body: "Jarayon passivda -ся bilan: Дом строится рабочими (uy quryapti — ishchilar tomonidan). Книга читается. Вопрос обсуждается.",
      },
      {
        heading: "СВ passiv: qisqa kesim",
        body: "Natija passivda qisqa majhul kesim: Дом построен (uy qurilgan/qurib bo'lingan). Письмо написано. Работа сделана. O'tgan/kelasi zamonda быть qo'shiladi: Дом был построен. Дом будет построен.",
        table: [
          ['Zamon', 'НСВ (jarayon)', 'СВ (natija)'],
          ['Hozirgi', 'Дом стро́ится', '—'],
          ["O'tgan", 'Дом стро́ился', 'Дом был постро́ен'],
          ['Kelasi', 'Дом бу́дет стро́иться', 'Дом бу́дет постро́ен'],
        ],
      },
      {
        heading: 'Bajaruvchi — Т.п',
        body: "Passivda ish bajaruvchi творительный kelishikda: Роман написан Толстым (roman Tolstoy tomonidan yozilgan). Bajaruvchini aytmaslik ham mumkin — bu passivning asosiy maqsadi.",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha '-il' nisbatiga mos: qurILmoqda = строится, qurILgan = построен, 'Tolstoy tomonidan' = Толстым (predlogsiz Т.п!). 'томонидан' so'zini tarjima qilish shart emas.",
    examples: [
      { ru: 'Э́тот вопро́с сейча́с обсужда́ется.', uz: 'Bu masala hozir muhokama qilinmoqda.' },
      { ru: 'Рома́н «Война́ и мир» напи́сан Толсты́м.', uz: '«Urush va tinchlik» romani Tolstoy tomonidan yozilgan.' },
      { ru: 'Магази́н был закры́т на ремо́нт.', uz: "Do'kon ta'mirlash uchun yopilgan edi." },
      { ru: 'Дома́ зде́сь стро́ятся бы́стро.', uz: 'Bu yerda uylar tez quriladi.' },
      { ru: 'Биле́ты уже́ про́даны.', uz: 'Chiptalar allaqachon sotib bo‘lingan.' },
    ],
    commonMistakes: [
      { wrong: 'Роман написан от Толстого', right: 'Роман написан Толстым', why_uz: 'Bajaruvchi predlogsiz Т.п da.' },
      { wrong: 'Дом строен', right: 'Дом построен / Дом строится', why_uz: 'НСВ → -ся, СВ → to‘liq qisqa kesim.' },
      { wrong: 'Письмо написано вчера мной написал', right: 'Письмо написано мной вчера', why_uz: 'Passivda fe’l takrorlanmaydi.' },
    ],
    exercises: [
      { id: 'm9-pas-1', type: 'transform', prompt: 'Passivga o‘tkazing: «Рабочие строят дом»', answer: 'Дом строится рабочими', explanation_uz: 'НСВ → строится + Т.п.' },
      { id: 'm9-pas-2', type: 'transform', prompt: 'Passivga o‘tkazing: «Толстой написал роман»', answer: 'Роман написан Толстым', explanation_uz: 'СВ → написан + Т.п.' },
      { id: 'm9-pas-3', type: 'fillBlank', prompt: 'Билеты уже про́дан___.', answer: 'ы', explanation_uz: "ko'plik → проданы." },
      { id: 'm9-pas-4', type: 'choose', prompt: '«Uy qurilmoqda» qanday?', answer: 'Дом строится', choices: ['Дом строится', 'Дом построен', 'Дом строил', 'Дом будет строен'], explanation_uz: 'Jarayon → -ся.' },
      { id: 'm9-pas-5', type: 'choose', prompt: '«Uy qurib bo‘lingan» qanday?', answer: 'Дом построен', choices: ['Дом построен', 'Дом строится', 'Дом строился', 'Дом строящийся'], explanation_uz: 'Natija → qisqa kesim.' },
      { id: 'm9-pas-6', type: 'errorHunt', prompt: 'Xatoni toping: «Эта книга написана от известного автора»', answer: 'Эта книга написана известным автором', explanation_uz: 'Bajaruvchi — predlogsiz Т.п.' },
      { id: 'm9-pas-7', type: 'fillBlank', prompt: 'Магазин ___ закрыт вчера. (o‘tgan zamon)', answer: 'был', explanation_uz: 'был закрыт.' },
    ],
  },
  {
    id: 'm9-numerals-decl',
    module: 9,
    order: 3,
    level: 'B2',
    title: 'Sonlarning turlanishi',
    subtitle: 'с двумя друзьями, около пятисот',
    theory: [
      {
        heading: 'Sonlar ham turlanadi',
        body: "Kelishik talab qilinganda son ham, ot ham turlanadi: два друга → с двумя друзьями (ikki do'st bilan), к двум друзьям.",
        table: [
          ['Kelishik', '2', '5', '100'],
          ['И.п', 'два/две', 'пять', 'сто'],
          ['Р.п', 'двух', 'пяти́', 'ста'],
          ['Д.п', 'двум', 'пяти́', 'ста'],
          ['Т.п', 'двумя́', 'пятью́', 'ста'],
          ['П.п', 'о двух', 'о пяти́', 'о ста'],
        ],
      },
      {
        heading: 'оба/обе',
        body: "'ikkalasi': erkak/o'rta rod — оба (обоих, обоим...), ayol rod — обе (обеих, обеим...): обоими руками emas, обеими руками (рука — ж).",
      },
      {
        heading: 'Tartib sonlar',
        body: "Tartib sonlar sifatdek turlanadi, murakkab tartib sonda faqat oxirgisi o'zgaradi: в две тысячи двадцать шестом году (2026-yilda).",
      },
    ],
    comparisonWithUzbek:
      "O'zbek tilida son o'zgarmaydi ('ikki do'st bilan'), rus tilida esa son ham kelishik oladi: с двумя друзьями. Bu B2 darajaning eng mexanik yodlanadigan mavzusi.",
    examples: [
      { ru: 'Я пришёл с двумя́ друзья́ми.', uz: "Ikki do'stim bilan keldim." },
      { ru: 'В за́ле о́коло пятисо́т челове́к.', uz: 'Zalda besh yuzga yaqin odam bor.' },
      { ru: 'Он говори́л о трёх пробле́мах.', uz: 'U uchta muammo haqida gapirdi.' },
      { ru: 'Обе́ими рука́ми держи́сь!', uz: 'Ikkala qo‘l bilan ushlan!' },
      { ru: 'Э́то случи́лось в две ты́сячи деся́том году́.', uz: 'Bu 2010-yilda sodir bo‘lgan.' },
    ],
    commonMistakes: [
      { wrong: 'с два друзья', right: 'с двумя друзьями', why_uz: 'с + Т.п: son ham turlanadi.' },
      { wrong: 'обоими руками', right: 'обеими руками', why_uz: 'рука ж → обе/обеими.' },
      { wrong: 'в двадцать шестой году', right: 'в двадцать шестом году', why_uz: 'П.п: -ом.' },
    ],
    exercises: [
      { id: 'm9-num-1', type: 'transform', prompt: 'Kerakli shaklga: «Я пришёл с (два) друзьями»', answer: 'двумя', explanation_uz: 'Т.п: двумя.' },
      { id: 'm9-num-2', type: 'transform', prompt: 'Kerakli shaklga: «Он говорил о (три) проблемах»', answer: 'трёх', explanation_uz: 'П.п: о трёх.' },
      { id: 'm9-num-3', type: 'choose', prompt: '«ikkala qo‘l bilan» qanday?', answer: 'обеими руками', choices: ['обеими руками', 'обоими руками', 'обе руками', 'обоих руках'], explanation_uz: 'рука ж → обеими.' },
      { id: 'm9-num-4', type: 'fillBlank', prompt: 'У него нет пят___ рублей. (5)', answer: 'и', explanation_uz: 'Р.п: пяти.' },
      { id: 'm9-num-5', type: 'choose', prompt: '«2026-yilda» qanday tugaydi?', answer: 'в две тысячи двадцать шестом году', choices: ['в две тысячи двадцать шестом году', 'в две тысячи двадцать шесть году', 'в двух тысяч двадцать шестой год', 'в две тысячи двадцать шестой году'], explanation_uz: 'Faqat oxirgi son turlanadi: шестом (П.п).' },
      { id: 'm9-num-6', type: 'errorHunt', prompt: 'Xatoni toping: «Мы говорили о два фильма»', answer: 'Мы говорили о двух фильмах', explanation_uz: 'о + П.п: двух фильмах.' },
    ],
  },
  {
    id: 'm9-aspect-prefixes',
    module: 9,
    order: 4,
    level: 'B2',
    title: "Prefikslar ma'nolari",
    subtitle: 'поработать, заговорить, переделать',
    theory: [
      {
        heading: "Prefiks fe'l ma'nosini boyitadi",
        body: "Bir fe'lga turli prefikslar turli ma'no beradi — bu rus leksikasining yadrosi.",
        table: [
          ['Prefiks', "Ma'no", 'Misol'],
          ['по-', 'biroz / qisqa', 'порабо́тать — biroz ishlamoq'],
          ['за-', 'boshlanish', 'заговори́ть — gapira boshlamoq'],
          ['пере-', 'qayta / ortiqcha', 'переде́лать — qayta qilmoq'],
          ['до-', 'oxirigacha', 'дочита́ть — oxirigacha o‘qimoq'],
          ['недо-', 'yetarli emas', 'недоспа́ть — uyquga to‘ymaslik'],
          ['раз-/рас-', 'tarqalish/kuchayish', 'рассказа́ть, разгоре́ться'],
          ['от-', 'tugatish/javob', 'отрабо́тать, отве́тить'],
        ],
      },
      {
        heading: "Bir ildiz — o'nlab fe'l",
        body: "писать: написать (yozib bo'lmoq), переписать (qayta yozmoq), записать (yozib olmoq), подписать (imzolamoq), описать (tasvirlamoq), выписать (ko'chirib yozmoq). Prefikslarni bilish lug'atni portlatib kengaytiradi.",
      },
    ],
    comparisonWithUzbek:
      "O'zbek ko'makchi fe'llariga mos: 'biroz ishlaB OLmoq' = поработать, 'gapira BOSHLAmoq' = заговорить, 'qaytaDAN qilmoq' = переделать, 'o'qiB CHIQmoq' = дочитать/прочитать.",
    examples: [
      { ru: 'Дава́й немно́го порабо́таем.', uz: 'Kel, biroz ishlaylik.' },
      { ru: 'Все вдруг заговори́ли.', uz: 'Hamma birdan gapira boshladi.' },
      { ru: 'Э́то на́до переде́лать.', uz: 'Buni qayta qilish kerak.' },
      { ru: 'Я дочита́л кни́гу до конца́.', uz: 'Kitobni oxirigacha o‘qib chiqdim.' },
      { ru: 'Запиши́ мой но́мер.', uz: 'Raqamimni yozib ol.' },
    ],
    commonMistakes: [
      { wrong: 'написать (yozib olmoq ma’nosida)', right: 'записать', why_uz: 'написать — yozib tugatmoq, записать — qayd qilib olmoq.' },
      { wrong: 'переписать (imzolamoq)', right: 'подписать', why_uz: 'под- = ostiga (imzo), пере- = qayta.' },
    ],
    exercises: [
      { id: 'm9-pref-1', type: 'choose', prompt: '«gapira boshladi» qanday?', answer: 'заговорил', choices: ['заговорил', 'поговорил', 'переговорил', 'договорил'], explanation_uz: 'за- = boshlanish.' },
      { id: 'm9-pref-2', type: 'choose', prompt: '«qayta qilmoq» qanday?', answer: 'переделать', choices: ['переделать', 'доделать', 'заделать', 'поделать'], explanation_uz: 'пере- = qayta.' },
      { id: 'm9-pref-3', type: 'choose', prompt: '«raqamni yozib ol» qanday?', answer: 'запиши номер', choices: ['запиши номер', 'напиши номер', 'подпиши номер', 'опиши номер'], explanation_uz: 'записать — qayd qilmoq.' },
      { id: 'm9-pref-4', type: 'choose', prompt: '«hujjatni imzolamoq»?', answer: 'подписать документ', choices: ['подписать документ', 'написать документ', 'переписать документ', 'выписать документ'], explanation_uz: 'под- + писать = imzolamoq.' },
      { id: 'm9-pref-5', type: 'fillBlank', prompt: 'Я ___читал книгу до конца. (oxirigacha)', answer: 'до', explanation_uz: 'дочитать — oxirigacha.' },
      { id: 'm9-pref-6', type: 'choose', prompt: 'по- prefiksining asosiy ma’nosi?', answer: 'biroz / qisqa muddat', choices: ['biroz / qisqa muddat', 'boshlanish', 'qayta', 'tugatish'], explanation_uz: 'погулять — biroz sayr qilmoq.' },
      { id: 'm9-pref-7', type: 'translate', prompt: 'Tarjima qiling: «Kel, biroz sayr qilaylik» (гулять)', answer: 'Давай погуляем', explanation_uz: 'по- + гулять.' },
    ],
  },
  {
    id: 'm9-subjunctive',
    module: 9,
    order: 5,
    level: 'B2',
    title: 'Shart mayli chuqur: бы',
    subtitle: 'Я бы хотел..., если бы..., чтобы...',
    theory: [
      {
        heading: 'бы + o‘tgan zamon',
        body: "Istak, noreal holat, muloyim taklif — hammasi бы + o'tgan zamon shakli: Я бы хотел кофе (kofe olardim). Было бы хорошо... (yaxshi bo'lardi). На твоём месте я бы... (sening o'rningda men...).",
      },
      {
        heading: 'если бы — noreal shart',
        body: "Ikkala qismda ham бы: Если бы у меня было время, я бы пришёл (vaqtim bo'lganida kelardim). O'tgan, hozirgi, kelasi — kontekstdan: rus tilida noreal shartda zamon farqi yo'q!",
      },
      {
        heading: 'чтобы + бы ichida',
        body: "чтобы o'zi что+бы dan yasalgan, shuning uchun undan keyin doim o'tgan zamon: Я хочу, чтобы ты знал. Скажи ему, чтобы он не опаздывал.",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha '-ardi' shakliga mos: 'kelARDIm' = я бы пришёл, 'bo'lgANIDA' = если бы было. Muloyimlik uchun ham: 'xohlARDIm' = я бы хотел — bu xizmat ko'rsatishda juda foydali.",
    examples: [
      { ru: 'Я бы хоте́л зарезерви́ровать сто́лик.', uz: 'Stol band qilmoqchi edim. (muloyim)' },
      { ru: 'Е́сли бы я знал, я бы помо́г.', uz: 'Bilganimda yordam berardim.' },
      { ru: 'Бы́ло бы здо́рово встре́титься!', uz: 'Uchrashsak zo‘r bo‘lardi!' },
      { ru: 'На твоём ме́сте я бы извини́лся.', uz: "Sening o'rningda uzr so'rardim." },
      { ru: 'Что бы ты сде́лал с миллио́ном?', uz: 'Million bilan nima qilarding?' },
    ],
    commonMistakes: [
      { wrong: 'Если бы я буду знать', right: 'Если бы я знал', why_uz: "бы dan keyin faqat o'tgan zamon shakli." },
      { wrong: 'Я бы хочу', right: 'Я бы хотел', why_uz: 'бы + хотел (o‘tgan shakl), хочу emas.' },
      { wrong: 'Если я бы знал, я помог', right: 'Если бы я знал, я бы помог', why_uz: 'Noreal shartda ikkala qismda ham бы.' },
    ],
    exercises: [
      { id: 'm9-subj-1', type: 'fillBlank', prompt: 'Я ___ хотел чашку кофе. (muloyim istak)', answer: 'бы', explanation_uz: 'Я бы хотел — muloyim.' },
      { id: 'm9-subj-2', type: 'transform', prompt: 'Noreal shartga: «Если у меня есть время, я приду»', answer: 'Если бы у меня было время, я бы пришёл', explanation_uz: 'если бы + было, я бы + пришёл.' },
      { id: 'm9-subj-3', type: 'choose', prompt: "Qaysi gap to'g'ri?", answer: 'Если бы я знал, я бы сказал', choices: ['Если бы я знал, я бы сказал', 'Если бы я знаю, я бы скажу', 'Если бы я буду знать, я скажу', 'Если я бы знал, я сказал'], explanation_uz: "Ikkala qism ham бы + o'tgan zamon." },
      { id: 'm9-subj-4', type: 'translate', prompt: 'Tarjima qiling: «Sening o‘rningda men kutardim» (ждать)', answer: 'На твоём месте я бы ждал', explanation_uz: 'на твоём месте я бы...' },
      { id: 'm9-subj-5', type: 'errorHunt', prompt: 'Xatoni toping: «Я хочу, чтобы ты придёшь»', answer: 'Я хочу, чтобы ты пришёл', explanation_uz: 'чтобы + o‘tgan shakl.' },
      { id: 'm9-subj-6', type: 'fillBlank', prompt: 'Было ___ хорошо поехать на море.', answer: 'бы', explanation_uz: 'Было бы хорошо — orzu.' },
    ],
  },
  {
    id: 'm9-bookish-preps',
    module: 9,
    order: 6,
    level: 'B2',
    title: 'Kitobiy predloglar',
    subtitle: 'благодаря, несмотря на, в течение',
    theory: [
      {
        heading: 'Rasmiy uslub predloglari',
        body: "B2+ matnlarda (yangiliklar, hujjatlar) keng ishlatiladi:",
        table: [
          ['Predlog', 'Kelishik', "Ma'no", 'Misol'],
          ['благодаря́', 'Д.п', 'tufayli (ijobiy)', 'благодаря́ тебе́'],
          ['из-за', 'Р.п', 'sababli (salbiy)', 'из-за дождя́'],
          ['несмотря́ на', 'В.п', '-ga qaramay', 'несмотря́ на пого́ду'],
          ['в тече́ние', 'Р.п', 'davomida', 'в тече́ние го́да'],
          ['по́сле', 'Р.п', 'keyin', 'по́сле рабо́ты'],
          ['всле́дствие', 'Р.п', 'oqibatida', 'всле́дствие ава́рии'],
          ['согла́сно', 'Д.п', 'muvofiq', 'согла́сно пла́ну'],
        ],
      },
      {
        heading: 'благодаря vs из-за',
        body: "Ikkalasi ham 'sababli', lekin благодаря — yaxshi natija (rahmat aytgudek sabab), из-за — yomon natija: Благодаря тебе мы успели. Из-за тебя мы опоздали.",
      },
    ],
    comparisonWithUzbek:
      "'tufayli' (ijobiy) = благодаря + Д.п, 'sababli/dastidan' (salbiy) = из-за + Р.п, '-ga qaramay' = несмотря на + В.п, 'davomida' = в течение + Р.п, 'muvofiq' = согласно + Д.п (Р.п EMAS — eng keng tarqalgan xato!).",
    examples: [
      { ru: 'Благодаря́ учи́телю я сдал экза́мен.', uz: "O'qituvchi tufayli imtihondan o'tdim." },
      { ru: 'Из-за про́бок я опозда́л.', uz: 'Tirbandlik sababli kechikdim.' },
      { ru: 'Несмотря́ на дождь, мы пошли́ гуля́ть.', uz: "Yomg'irga qaramay sayrga chiqdik." },
      { ru: 'В тече́ние неде́ли всё бу́дет гото́во.', uz: 'Bir hafta davomida hammasi tayyor bo‘ladi.' },
      { ru: 'Согла́сно догово́ру, опла́та в конце́ ме́сяца.', uz: "Shartnomaga muvofiq to'lov oy oxirida." },
    ],
    commonMistakes: [
      { wrong: 'благодаря дождя (kechikish sababi)', right: 'из-за дождя', why_uz: 'Salbiy sabab — из-за; благодаря faqat ijobiy.' },
      { wrong: 'согласно договора', right: 'согласно договору', why_uz: 'согласно + Д.п (rus tilida ham mashhur xato!).' },
      { wrong: 'несмотря на дождя', right: 'несмотря на дождь', why_uz: 'несмотря на + В.п.' },
    ],
    exercises: [
      { id: 'm9-bp-1', type: 'choose', prompt: '___ тебе мы выиграли! (tufayli)', answer: 'Благодаря', choices: ['Благодаря', 'Из-за', 'Несмотря на', 'Вследствие'], explanation_uz: 'Ijobiy natija → благодаря.' },
      { id: 'm9-bp-2', type: 'choose', prompt: '___ дождя мы опоздали. (sababli)', answer: 'Из-за', choices: ['Из-за', 'Благодаря', 'Согласно', 'В течение'], explanation_uz: 'Salbiy → из-за.' },
      { id: 'm9-bp-3', type: 'fillBlank', prompt: 'Несмотря ___ холод, он пришёл.', answer: 'на', explanation_uz: 'несмотря на + В.п.' },
      { id: 'm9-bp-4', type: 'transform', prompt: 'Kerakli shaklga: «согласно (план)»', answer: 'плану', explanation_uz: 'согласно + Д.п.' },
      { id: 'm9-bp-5', type: 'transform', prompt: 'Kerakli shaklga: «в течение (год)»', answer: 'года', explanation_uz: 'в течение + Р.п.' },
      { id: 'm9-bp-6', type: 'errorHunt', prompt: 'Xatoni toping: «Благодаря пробкам я опоздал на работу»', answer: 'Из-за пробок я опоздал на работу', explanation_uz: 'Kechikish — salbiy → из-за.' },
      { id: 'm9-bp-7', type: 'translate', prompt: 'Tarjima qiling: «Sovuqqa qaramay biz keldik» (холод)', answer: 'Несмотря на холод, мы пришли', explanation_uz: 'несмотря на + В.п.' },
    ],
  },
  {
    id: 'm9-word-order',
    module: 9,
    order: 7,
    level: 'B2',
    title: "So'z tartibi va urg'u mantiqlari",
    subtitle: 'Yangi axborot gap oxirida',
    theory: [
      {
        heading: 'Erkin, lekin mantiqli',
        body: "Rus tilida so'z tartibi erkin, lekin ma'no soyasini o'zgartiradi. Asosiy qoida: YANGI va MUHIM axborot gap OXIRIDA turadi: Книга на столе (kitob QAYERDA? — stolda) vs На столе книга (stolda NIMA bor? — kitob).",
        table: [
          ['Gap', 'Savol-javob mantiqi'],
          ['Кни́га на столе́.', 'Kitob qayerda? — Stolda.'],
          ['На столе́ кни́га.', 'Stolda nima bor? — Kitob.'],
          ['Я е́ду за́втра.', 'Qachon ketaman? — Ertaga.'],
          ['За́втра е́ду я.', 'Ertaga kim ketadi? — Men.'],
        ],
      },
      {
        heading: 'Inversiya his-tuyg‘uda',
        body: "She'riy/emotsional nutqda tartib buziladi: Хорошая сегодня погода! (qanday yaxshi havo!). Bu og'zaki nutqqa joziba beradi.",
      },
    ],
    comparisonWithUzbek:
      "O'zbek tilida tartib qat'iyroq (ega-to'ldiruvchi-kesim). Ruschada kesim o'rtada erkin yuradi, lekin 'yangi axborot oxirida' qoidasi o'zbek tiliga ham xos — shu intuitsiyangizga ishoning.",
    examples: [
      { ru: 'В э́том до́ме живёт мой друг.', uz: "Bu uyda do'stim yashaydi. (KIM yashashi yangi)" },
      { ru: 'Мой друг живёт в э́том до́ме.', uz: "Do'stim shu uyda yashaydi. (QAYERDA yangi)" },
      { ru: 'За́втра бу́дет экза́мен.', uz: 'Ertaga imtihon bo‘ladi.' },
      { ru: 'Экза́мен бу́дет за́втра.', uz: 'Imtihon ertaga bo‘ladi.' },
    ],
    commonMistakes: [
      { wrong: "Har doim bir xil qolip ishlatish", right: "Yangi axborotni oxiriga qo'yish", why_uz: "Savolga qarab tartib o'zgaradi — javob doim oxirida." },
    ],
    exercises: [
      { id: 'm9-wo-1', type: 'choose', prompt: '«Stolda NIMA bor?» javobiga mos gap:', answer: 'На столе книга', choices: ['На столе книга', 'Книга на столе', 'Стол на книге', 'Книга стол на'], explanation_uz: 'Yangi axborot (книга) oxirida.' },
      { id: 'm9-wo-2', type: 'choose', prompt: '«Kitob QAYERDA?» javobiga mos gap:', answer: 'Книга на столе', choices: ['Книга на столе', 'На столе книга', 'На книге стол', 'Стол книга на'], explanation_uz: 'Yangi axborot (на столе) oxirida.' },
      { id: 'm9-wo-3', type: 'choose', prompt: '«Ertaga KIM ketadi?» javobi:', answer: 'Завтра еду я', choices: ['Завтра еду я', 'Я еду завтра', 'Еду я завтра', 'Я завтра еду'], explanation_uz: 'я — yangi axborot, oxirida.' },
      { id: 'm9-wo-4', type: 'sentenceBuilder', prompt: '«Bu shaharda buvim yashaydi» (KIM — yangi)', answer: 'В этом городе живёт моя бабушка', tokens: ['живёт', 'В', 'городе', 'бабушка', 'этом', 'моя'], explanation_uz: 'Yangi axborot — бабушка — gap oxirida.' },
      { id: 'm9-wo-5', type: 'choose', prompt: 'Emotsional gap qaysi?', answer: 'Хорошая сегодня погода!', choices: ['Хорошая сегодня погода!', 'Сегодня хорошая погода.', 'Погода сегодня хорошая.', 'Сегодня погода хорошая.'], explanation_uz: 'Sifatni boshga chiqarish — his-tuyg‘u.' },
    ],
  },
  {
    id: 'm9-verb-government',
    module: 9,
    order: 8,
    level: 'B2',
    title: "Fe'l boshqaruvi",
    subtitle: 'ждать кого? гордиться чем? зависеть от чего?',
    theory: [
      {
        heading: "Har fe'l o'z kelishigini talab qiladi",
        body: "Fe'lni kelishigi va predlogi bilan birga yodlash — B2 ning oltin qoidasi.",
        table: [
          ["Fe'l", 'Boshqaruv', 'Misol'],
          ['жда́ть', 'кого/что (В/Р)', 'жду дру́га, жду отве́та'],
          ['горди́ться', 'кем/чем (Т)', 'горжу́сь сы́ном'],
          ['зави́сеть', 'от кого/чего (Р)', 'зави́сит от пого́ды'],
          ['ве́рить', 'кому (Д) / во что (В)', 'ве́рю тебе́, ве́рю в успе́х'],
          ['боя́ться', 'кого/чего (Р)', 'бою́сь темноты́'],
          ['поздравля́ть', 'кого с чем', 'поздравля́ю с пра́здником'],
          ['уча́ствовать', 'в чём (П)', 'уча́ствую в конку́рсе'],
          ['привыка́ть', 'к чему (Д)', 'привы́к к хо́лоду'],
        ],
      },
    ],
    comparisonWithUzbek:
      "O'zbekchadan to'g'ridan-to'g'ri ko'chirish ishlamaydi: 'senGA ishonaman' = верю тебе (Д.п — mos!), lekin 'muvaffaqiyatGA ishonaman' = верю В успех (в + В.п). 'imtihonDAN qo'rqaman' = боюсь экзамена (Р.п, -dan predlogsiz).",
    examples: [
      { ru: 'Я горжу́сь свое́й семьёй.', uz: 'Men oilam bilan faxrlanaman.' },
      { ru: 'Всё зави́сит от тебя́.', uz: "Hammasi senga bog'liq." },
      { ru: 'Поздравля́ю тебя́ с днём рожде́ния!', uz: "Tug'ilgan kuning bilan tabriklayman!" },
      { ru: 'Он бои́тся выступа́ть пе́ред людьми́.', uz: 'U odamlar oldida chiqishdan qo‘rqadi.' },
      { ru: 'Я привы́к к ра́ннему подъёму.', uz: 'Erta turishga o‘rganib qolganman.' },
    ],
    commonMistakes: [
      { wrong: 'горжусь на сына', right: 'горжусь сыном', why_uz: 'гордиться + Т.п predlogsiz.' },
      { wrong: 'зависит на погоды', right: 'зависит от погоды', why_uz: 'зависеть от + Р.п.' },
      { wrong: 'поздравляю тебя на праздник', right: 'поздравляю тебя с праздником', why_uz: 'поздравлять с + Т.п.' },
      { wrong: 'верю в тебе', right: 'верю тебе / верю в тебя', why_uz: 'верить кому (Д.п) yoki верить в кого (В.п).' },
    ],
    exercises: [
      { id: 'm9-vg-1', type: 'fillBlank', prompt: 'Я горжусь сво___ работой. (Т.п)', answer: 'ей', explanation_uz: 'гордиться чем — своей работой.' },
      { id: 'm9-vg-2', type: 'fillBlank', prompt: 'Всё зависит ___ погоды.', answer: 'от', explanation_uz: 'зависеть от + Р.п.' },
      { id: 'm9-vg-3', type: 'fillBlank', prompt: 'Поздравляю тебя ___ Новым годом!', answer: 'с', explanation_uz: 'поздравлять с + Т.п.' },
      { id: 'm9-vg-4', type: 'transform', prompt: 'Kerakli shaklga: «Я боюсь (экзамен)»', answer: 'экзамена', explanation_uz: 'бояться + Р.п.' },
      { id: 'm9-vg-5', type: 'transform', prompt: 'Kerakli shaklga: «Мы участвуем в (конкурс)»', answer: 'конкурсе', explanation_uz: 'участвовать в + П.п.' },
      { id: 'm9-vg-6', type: 'errorHunt', prompt: 'Xatoni toping: «Я верю в тебе»', answer: 'Я верю тебе', explanation_uz: 'верить кому — Д.п (yoki верю в тебя).' },
      { id: 'm9-vg-7', type: 'fillBlank', prompt: 'Он привык ___ холоду.', answer: 'к', explanation_uz: 'привыкать к + Д.п.' },
      { id: 'm9-vg-8', type: 'translate', prompt: 'Tarjima qiling: «Men javobingni kutyapman» (ждать, ответ)', answer: 'Я жду твоего ответа', explanation_uz: 'ждать + mavhum narsa Р.п.' },
    ],
  },
];
