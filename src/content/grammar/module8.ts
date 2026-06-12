import type { GrammarTopic } from '../../types';

/** Modul 8 — B1+: kesim, ravishdosh, yuklamalar, muloqot odobi, dialoglar */
export const MODULE_8: GrammarTopic[] = [
  {
    id: 'm8-participles',
    module: 8,
    order: 1,
    level: 'B1',
    title: 'Kesim (причастия) — tanishuv',
    subtitle: 'читающий, прочитанный',
    theory: [
      {
        heading: 'Faol kesim',
        body: "-ущ/-ющ/-ащ/-ящ: читающий (o'qiyotgan), говорящий (gapirayotgan). Kitobiy uslubda ishlatiladi; og'zaki nutqda который bilan almashtirish mumkin: человек, читающий книгу = человек, который читает книгу.",
      },
      {
        heading: 'Majhul kesim',
        body: "-нн/-т: прочитанный (o'qilgan), сделанный (qilingan), закрытый (yopilgan). Qisqa shakli juda ko'p ishlatiladi: Магазин закрыт (do'kon yopiq). Работа сделана (ish qilingan).",
        table: [
          ["Fe'l", 'Kesim', 'Qisqa shakl'],
          ['закры́ть', 'закры́тый', 'закры́т / закры́та / закры́то'],
          ['откры́ть', 'откры́тый', 'откры́т'],
          ['сде́лать', 'сде́ланный', 'сде́лан'],
          ['написа́ть', 'напи́санный', 'напи́сан'],
        ],
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha '-gan' sifatdoshiga mos: 'o'qilGAN kitob' = прочитанная книга, 'yopiq/yopilGAN' = закрыт. Qisqa shakl (закрыт, открыт, написан) kundalik nutqda eng keraklisi.",
    examples: [
      { ru: 'Магази́н закры́т.', uz: 'Do‘kon yopiq.' },
      { ru: 'Музе́й откры́т с девяти́ часо́в.', uz: 'Muzey soat to‘qqizdan ochiq.' },
      { ru: 'Рабо́та уже́ сде́лана.', uz: 'Ish allaqachon qilingan.' },
      { ru: 'Письмо́ напи́сано вчера́.', uz: 'Xat kecha yozilgan.' },
    ],
    commonMistakes: [
      { wrong: 'Магазин закрытый (kesim sifatida)', right: 'Магазин закрыт', why_uz: 'Holatni qisqa shakl bildiradi.' },
      { wrong: 'Работа сделан', right: 'Работа сделана', why_uz: 'работа ж → сделана.' },
    ],
    exercises: [
      { id: 'm8-part-1', type: 'fillBlank', prompt: 'Магазин закры___. (yopiq)', answer: 'т', explanation_uz: 'магазин м → закрыт.' },
      { id: 'm8-part-2', type: 'fillBlank', prompt: 'Дверь закры___. (yopiq)', answer: 'та', explanation_uz: 'дверь ж → закрыта.' },
      { id: 'm8-part-3', type: 'choose', prompt: '«Ish qilingan» qanday?', answer: 'Работа сделана', choices: ['Работа сделана', 'Работа сделан', 'Работа сделать', 'Работа делала'], explanation_uz: 'ж → сделана.' },
      { id: 'm8-part-4', type: 'transform', prompt: 'который bilan almashtiring: «человек, читающий книгу»', answer: 'человек, который читает книгу', explanation_uz: "Og'zaki uslub: который." },
      { id: 'm8-part-5', type: 'translate', prompt: 'Tarjima qiling: «Muzey ochiq»', answer: 'Музей открыт', explanation_uz: 'открыт.' },
    ],
  },
  {
    id: 'm8-gerund',
    module: 8,
    order: 2,
    level: 'B1',
    title: 'Ravishdosh (деепричастия) — tanishuv',
    subtitle: 'читая, прочитав',
    theory: [
      {
        heading: 'НСВ ravishdoshi: -я',
        body: "Bir paytda bo'layotgan ikkinchi ish: Он шёл, слушая музыку (musiqa tinglaB ketardi). читая (o'qib turib), говоря (gapirib turib), думая.",
      },
      {
        heading: 'СВ ravishdoshi: -в',
        body: "Oldin tugagan ish: Прочитав книгу, я лёг спать (kitobni o'qib bo'liB, uxlashga yotdim). сделав (qilib bo'lib), купив (sotib olib).",
      },
      {
        heading: "Og'zaki muqobillar",
        body: "Og'zaki nutqda ko'pincha когда yoki после того как bilan almashtiriladi: Прочитав книгу... = После того как я прочитал книгу...",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha '-ib' ravishdoshiga juda mos: 'musiqa tinglab' = слушая музыку, 'o'qib bo'lib' = прочитав. O'zbek tilida bu shakl juda tabiiy — ruschasini ham oson o'zlashtirasiz.",
    examples: [
      { ru: 'Он за́втракал, чита́я газе́ту.', uz: 'U gazeta o‘qib nonushta qilardi.' },
      { ru: 'Сде́лав уро́ки, я пошёл гуля́ть.', uz: 'Darslarni qilib bo‘lib, sayrga chiqdim.' },
      { ru: 'Говоря́ по телефо́ну, она́ гото́вила у́жин.', uz: 'Telefonda gaplashib, kechki ovqat tayyorlardi.' },
    ],
    commonMistakes: [
      { wrong: 'Читав книгу...', right: 'Читая книгу... / Прочитав книгу...', why_uz: 'НСВ → -я, СВ → -в.' },
      { wrong: "Ega farqli bo'lsa ishlatish", right: 'Bir gapda bitta ega', why_uz: 'Ravishdosh faqat asosiy ega bilan bir xil shaxsga tegishli.' },
    ],
    exercises: [
      { id: 'm8-ger-1', type: 'choose', prompt: '«musiqa tinglab» qanday?', answer: 'слушая музыку', choices: ['слушая музыку', 'слушав музыку', 'слушать музыку', 'слушал музыку'], explanation_uz: 'НСВ → слушая.' },
      { id: 'm8-ger-2', type: 'choose', prompt: '«kitobni o‘qib bo‘lib» qanday?', answer: 'прочитав книгу', choices: ['прочитав книгу', 'прочитая книгу', 'читав книгу', 'прочитал книгу'], explanation_uz: 'СВ → -в: прочитав.' },
      { id: 'm8-ger-3', type: 'transform', prompt: "Ravishdosh bilan qisqartiring: «Когда он шёл домой, он думал о работе»", answer: 'Идя домой, он думал о работе', explanation_uz: 'идти → идя.' },
      { id: 'm8-ger-4', type: 'translate', prompt: 'Tarjima qiling: «Ishni tugatib, men uyga ketdim» (закончить работу)', answer: 'Закончив работу, я пошёл домой', explanation_uz: 'СВ ravishdosh: закончив.' },
    ],
  },
  {
    id: 'm8-particles',
    module: 8,
    order: 3,
    level: 'B1',
    title: 'Yuklamalar: же, ли, ведь, -то/-нибудь',
    subtitle: "Nutqqa jon kirituvchi mayda so'zlar",
    theory: [
      {
        heading: '-то va -нибудь',
        body: "кто-то — kimdir (aniq, lekin men bilmayman): Кто-то звонил. кто-нибудь — kimdir bo'lsa ham/har qanday: Кто-нибудь может помочь? Savol va iltimosda -нибудь, darak gapda -то.",
        table: [
          ['-то (aniq noma’lum)', '-нибудь (istalgan)', ''],
          ['кто́-то', 'кто́-нибудь', 'kimdir'],
          ['что́-то', 'что́-нибудь', 'nimadir'],
          ['где́-то', 'где́-нибудь', 'qayerdadir'],
          ['когда́-то', 'когда́-нибудь', 'qachondir'],
        ],
      },
      {
        heading: 'же, ведь, ну',
        body: "же — ta'kid/sabrsizlik: Где же ты был?! (qayerda eding axir?!). ведь — axir: Ты ведь знал! (axir bilarding-ku!). ну — xo'sh/qani: Ну, пошли! Bu yuklamalar nutqni tabiiy qiladi.",
      },
    ],
    comparisonWithUzbek:
      "'-dir' = -то, 'biror' = -нибудь: 'kimDIR keldi' = кто-то пришёл, 'BIROR kim bormi?' = есть кто-нибудь? же/ведь o'zbekcha 'axir/-ku' ga mos: 'bilarding-KU' = ты ведь знал.",
    examples: [
      { ru: 'Кто́-то стучи́т в дверь.', uz: 'Kimdir eshik taqillatyapti.' },
      { ru: 'Дай мне что́-нибудь почита́ть.', uz: 'O‘qishga biror narsa ber.' },
      { ru: 'Когда́-нибудь я пое́ду в Япо́нию.', uz: 'Qachondir Yaponiyaga boraman.' },
      { ru: 'Ты же обеща́л!', uz: 'Va’da bergan eding-ku!' },
      { ru: 'Э́то ведь про́сто.', uz: 'Axir bu oson-ku.' },
    ],
    commonMistakes: [
      { wrong: 'Кто-то может помочь? (savol)', right: 'Кто-нибудь может помочь?', why_uz: 'Savolda -нибудь.' },
      { wrong: 'Я видел кого-нибудь (darak)', right: 'Я видел кого-то', why_uz: 'Darak gapda aniq noma’lum → -то.' },
    ],
    exercises: [
      { id: 'm8-pt-1', type: 'choose', prompt: '___ звонил тебе утром. (darak gap)', answer: 'Кто-то', choices: ['Кто-то', 'Кто-нибудь', 'Кто же', 'Кто ведь'], explanation_uz: 'Darak → -то.' },
      { id: 'm8-pt-2', type: 'choose', prompt: '___ хочет чай? (taklif)', answer: 'Кто-нибудь', choices: ['Кто-нибудь', 'Кто-то', 'Кто же', 'Никто'], explanation_uz: 'Savol/taklif → -нибудь.' },
      { id: 'm8-pt-3', type: 'fillBlank', prompt: 'Расскажи мне что-___ интересное. (biror narsa)', answer: 'нибудь', explanation_uz: 'Iltimos → -нибудь.' },
      { id: 'm8-pt-4', type: 'choose', prompt: '«Axir bilarding-ku!» qanday?', answer: 'Ты ведь знал!', choices: ['Ты ведь знал!', 'Ты ли знал!', 'Ты-нибудь знал!', 'Ты то знал!'], explanation_uz: 'ведь — axir/-ku.' },
      { id: 'm8-pt-5', type: 'translate', prompt: 'Tarjima qiling: «Qachondir Moskvaga boraman»', answer: 'Когда-нибудь я поеду в Москву', explanation_uz: 'Kelajak orzu → когда-нибудь.' },
    ],
  },
  {
    id: 'm8-etiquette',
    module: 8,
    order: 4,
    level: 'B1',
    title: 'Muloqot odobi',
    subtitle: "Iltimos, uzr, minnatdorchilik, telefon",
    theory: [
      {
        heading: 'Iltimos qilish',
        body: "Oddiy: Дайте, пожалуйста... Muloyim: Не могли бы вы...? (bera olmasmidingiz?), Будьте добры... (marhamat qilib...). Можно...? (mumkinmi?)",
      },
      {
        heading: 'Uzr va javoblar',
        body: "Извините / Простите — kechirasiz. Извините за опоздание — kechikkanim uchun uzr. Javob: Ничего страшного (hechqisi yo'q), Не за что (arzimaydi — rahmatga javob).",
        table: [
          ['Vaziyat', 'Ibora', "Ma'no"],
          ['Rahmat', 'Спаси́бо большо́е', 'Katta rahmat'],
          ['Javob', 'Пожа́луйста / Не́ за что', 'Marhamat / Arzimaydi'],
          ['Uzr', 'Извини́те, пожа́луйста', 'Kechirasiz'],
          ['Javob', 'Ничего́ стра́шного', "Hechqisi yo'q"],
          ['Tabrik', 'Поздравля́ю!', 'Tabriklayman!'],
        ],
      },
      {
        heading: 'Telefonda',
        body: "Алло! / Слушаю (eshitaman). Можно Ивана? (Ivan bormi?) — Его нет, перезвоните позже (u yo'q, keyinroq qo'ng'iroq qiling). Вы ошиблись номером (notog'ri raqam terdingiz).",
      },
    ],
    comparisonWithUzbek:
      "пожалуйста uch vazifada: 1) iltimos (please), 2) marhamat (rahmatga javob), 3) mana, oling. O'zbek tilidagi 'iltimos/marhamat' ikkalasini ham qoplaydi.",
    examples: [
      { ru: 'Бу́дьте добры́, переда́йте соль.', uz: 'Marhamat qilib, tuzni uzating.' },
      { ru: 'Не могли́ бы вы мне помо́чь?', uz: 'Menga yordam bera olmasmidingiz?' },
      { ru: 'Извини́те за беспоко́йство.', uz: 'Bezovta qilganim uchun uzr.' },
      { ru: 'Спаси́бо огро́мное! — Не́ за что!', uz: 'Katta rahmat! — Arzimaydi!' },
      { ru: 'Алло́, мо́жно Дильшо́да? — Его́ нет до́ма.', uz: 'Allo, Dilshod bormi? — U uyda yo‘q.' },
    ],
    commonMistakes: [
      { wrong: 'Дай соль (notanishga)', right: 'Дайте, пожалуйста, соль', why_uz: 'Notanishga вы shakli + пожалуйста.' },
      { wrong: 'Спасибо → Да', right: 'Спасибо → Пожалуйста / Не за что', why_uz: "Rahmatga to'g'ri javob bor." },
    ],
    exercises: [
      { id: 'm8-et-1', type: 'choose', prompt: 'Rahmatga qanday javob beriladi?', answer: 'Пожалуйста', choices: ['Пожалуйста', 'Спасибо', 'Извините', 'Хорошо'], explanation_uz: 'Пожалуйста yoki Не за что.' },
      { id: 'm8-et-2', type: 'choose', prompt: '«Hechqisi yo‘q» qanday?', answer: 'Ничего страшного', choices: ['Ничего страшного', 'Не за что', 'Всё плохо', 'Никогда'], explanation_uz: 'Uzrga javob.' },
      { id: 'm8-et-3', type: 'translate', prompt: 'Tarjima qiling: «Kechikkanim uchun uzr»', answer: 'Извините за опоздание', explanation_uz: 'извинить за + В.п.' },
      { id: 'm8-et-4', type: 'choose', prompt: 'Muloyim iltimos qaysi?', answer: 'Не могли бы вы помочь?', choices: ['Не могли бы вы помочь?', 'Помоги!', 'Надо помочь!', 'Вы поможете.'], explanation_uz: 'Не могли бы вы — eng muloyim shakl.' },
      { id: 'm8-et-5', type: 'fillBlank', prompt: 'Алло! ___ Ивана? (chaqirib bering)', answer: 'Можно', explanation_uz: 'Можно Ивана? — telefon odobi.' },
    ],
    miniDialogue: [
      { speaker: 'A', ru: 'Извините, не могли бы вы сказать, как пройти к метро?', uz: 'Kechirasiz, metroga qanday borishni ayta olmasmidingiz?' },
      { speaker: 'B', ru: 'Конечно! Идите прямо, метро будет слева.', uz: 'Albatta! To‘g‘riga yuring, metro chap tomonda bo‘ladi.' },
      { speaker: 'A', ru: 'Спасибо большое!', uz: 'Katta rahmat!' },
      { speaker: 'B', ru: 'Не за что! Удачи!', uz: 'Arzimaydi! Omad!' },
    ],
  },
  {
    id: 'm8-dialogues',
    module: 8,
    order: 5,
    level: 'B1',
    title: 'Real vaziyatlar: do‘kon, taksi, shifoxona',
    subtitle: "Hayotiy dialoglar grammatika bilan",
    theory: [
      {
        heading: "Do'konda",
        body: "Сколько стоит...? (qancha turadi?), Покажите, пожалуйста... (ko'rsating), У вас есть...? (sizlarda ... bormi?), Я возьму это (men buni olaman), Можно картой? (karta bilan mumkinmi?)",
      },
      {
        heading: 'Taksida',
        body: "Мне нужно на вокзал (menga vokzalga kerak), Остановите здесь, пожалуйста (shu yerda to'xtating), Сколько с меня? (mendan qancha?)",
      },
      {
        heading: 'Shifokorda',
        body: "У меня болит голова/живот/горло (boshim/qornim/tomog'im og'riyapti — болит + И.п!), У меня температура (haroratim bor), Мне плохо (o'zimni yomon his qilyapman).",
        table: [
          ['Ibora', "Ma'no"],
          ['У меня́ боли́т голова́', "Boshim og'riyapti"],
          ['У меня́ боля́т но́ги', "Oyoqlarim og'riyapti (ko'plik → болят)"],
          ['Вы́зовите врача́!', "Shifokor chaqiring!"],
          ['Мне ну́жно лека́рство', 'Menga dori kerak'],
        ],
      },
    ],
    comparisonWithUzbek:
      "'Boshim og'riyapti' = У меня болит голова — so'zma-so'z 'menda bosh og'riyapti'. Og'riyotgan a'zo И.п da (ega!), odam esa у + Р.п da. Bu qolip o'zbekchadan farq qiladi, alohida yodlang.",
    examples: [
      { ru: 'Ско́лько сто́ит э́та руба́шка?', uz: 'Bu ko‘ylak qancha turadi?' },
      { ru: 'У вас есть хлеб? — Да, коне́чно.', uz: 'Sizlarda non bormi? — Ha, albatta.' },
      { ru: 'Мне ну́жно в аэропо́рт.', uz: 'Menga aeroportga kerak.' },
      { ru: 'У меня́ боли́т зуб.', uz: 'Tishim og‘riyapti.' },
      { ru: 'Останови́те на сле́дующей, пожа́луйста.', uz: 'Keyingisida to‘xtating, iltimos.' },
    ],
    commonMistakes: [
      { wrong: 'Моя голова болит у меня', right: 'У меня болит голова', why_uz: 'Qolip: У + Р.п + болит + И.п.' },
      { wrong: 'У меня болит ноги', right: 'У меня болят ноги', why_uz: "Ko'plik ega → болят." },
      { wrong: 'Сколько стоят эта книга?', right: 'Сколько стоит эта книга?', why_uz: 'Birlik → стоит.' },
    ],
    exercises: [
      { id: 'm8-dlg-1', type: 'translate', prompt: 'Tarjima qiling: «Bu qancha turadi?»', answer: 'Сколько это стоит?', explanation_uz: 'Сколько стоит?' },
      { id: 'm8-dlg-2', type: 'translate', prompt: 'Tarjima qiling: «Boshim og‘riyapti»', answer: 'У меня болит голова', explanation_uz: 'У меня болит + И.п.' },
      { id: 'm8-dlg-3', type: 'fillBlank', prompt: 'У меня бол___ ноги. (og‘riyapti)', answer: 'ят', explanation_uz: "Ko'plik → болят." },
      { id: 'm8-dlg-4', type: 'choose', prompt: 'Taksida: «Shu yerda to‘xtating»', answer: 'Остановите здесь, пожалуйста', choices: ['Остановите здесь, пожалуйста', 'Стойте здесь всегда', 'Здесь стоп', 'Остановка здесь'], explanation_uz: 'Остановите — buyruq вы shakli.' },
      { id: 'm8-dlg-5', type: 'choose', prompt: 'Do‘konda: «Karta bilan to‘lasam bo‘ladimi?»', answer: 'Можно картой?', choices: ['Можно картой?', 'Можно карта?', 'Карта есть?', 'Я карта.'], explanation_uz: 'картой — Т.п (vosita).' },
      { id: 'm8-dlg-6', type: 'translate', prompt: 'Tarjima qiling: «Sizlarda sut bormi?» (молоко)', answer: 'У вас есть молоко?', explanation_uz: 'У вас есть...?' },
      { id: 'm8-dlg-7', type: 'sentenceBuilder', prompt: 'Gap tuzing: «Menga vokzalga kerak»', answer: 'Мне нужно на вокзал', tokens: ['нужно', 'Мне', 'вокзал', 'на'], explanation_uz: 'Мне нужно на вокзал.' },
    ],
    miniDialogue: [
      { speaker: 'Sotuvchi', ru: 'Здравствуйте! Что вы хотите?', uz: 'Assalomu alaykum! Nima xohlaysiz?' },
      { speaker: 'Siz', ru: 'Покажите, пожалуйста, эту рубашку. Сколько она стоит?', uz: 'Iltimos, bu ko‘ylakni ko‘rsating. U qancha turadi?' },
      { speaker: 'Sotuvchi', ru: 'Две тысячи рублей. Хороший выбор!', uz: 'Ikki ming rubl. Yaxshi tanlov!' },
      { speaker: 'Siz', ru: 'Хорошо, я возьму её. Можно картой?', uz: 'Yaxshi, men uni olaman. Karta bilan mumkinmi?' },
      { speaker: 'Sotuvchi', ru: 'Конечно. Спасибо за покупку!', uz: 'Albatta. Xaridingiz uchun rahmat!' },
    ],
  },
];
