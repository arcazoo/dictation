import type { GrammarTopic } from '../../types';

/** Modul 6 — Sifat va ravish: moslashuv, qisqa shakl, qiyoslash (A2) */
export const MODULE_6: GrammarTopic[] = [
  {
    id: 'm6-agreement',
    module: 6,
    order: 1,
    level: 'A2',
    title: 'Sifat moslashuvi',
    subtitle: 'новый, новая, новое, новые',
    theory: [
      {
        heading: 'Rod va songa moslashish',
        body: "Sifat doim o'zi aniqlayotgan otga moslashadi: rod, son va kelishikda.",
        table: [
          ['Rod', "Qo'shimcha", 'Misol'],
          ['м', '-ый/-ий/-ой', 'но́вый дом, си́ний костю́м, большо́й го́род'],
          ['ж', '-ая/-яя', 'но́вая кни́га, си́няя ру́чка'],
          ['с', '-ое/-ее', 'но́вое окно́, си́нее мо́ре'],
          ["ko'plik", '-ые/-ие', 'но́вые дома́, си́ние ру́чки'],
        ],
      },
      {
        heading: 'Imlo qoidalari',
        body: "г, к, х, ж, ш, ч, щ dan keyin ы emas и: русский, хороший, большие. Urg'u oxirida bo'lsa м rod -ой: большой, молодой.",
      },
      {
        heading: 'Kelishiklarda',
        body: "Sifat ot bilan birga turlanadi: новый дом → в новом доме → около нового дома → новому дому. ж rod: новая → новую (В.п) → новой (Р/Д/Т/П).",
      },
    ],
    comparisonWithUzbek:
      "O'zbek tilida sifat o'zgarmaydi: 'yangi uy, yangi kitob, yangi uylar'. Rus tilida esa har safar moslashadi — bu doimiy mashq talab qiladigan odat.",
    examples: [
      { ru: 'но́вый телефо́н', uz: 'yangi telefon' },
      { ru: 'кра́сная маши́на', uz: 'qizil mashina' },
      { ru: 'вку́сное я́блоко', uz: 'mazali olma' },
      { ru: 'интере́сные кни́ги', uz: 'qiziqarli kitoblar' },
      { ru: 'Я живу́ в большо́м го́роде.', uz: 'Men katta shaharda yashayman.', note: 'П.п: -ом' },
      { ru: 'Я чита́ю интере́сную кни́гу.', uz: 'Qiziqarli kitob o‘qiyapman.', note: 'В.п: -ую' },
    ],
    commonMistakes: [
      { wrong: 'новый книга', right: 'новая книга', why_uz: 'книга ж → новая.' },
      { wrong: 'красная яблоко', right: 'красное яблоко', why_uz: 'яблоко с → красное.' },
      { wrong: 'большый', right: 'большой', why_uz: "Urg'u oxirida → -ой; ж/ш dan keyin imlo." },
      { wrong: 'русскые', right: 'русские', why_uz: 'к dan keyin и.' },
    ],
    exercises: [
      { id: 'm6-agr-1', type: 'fillBlank', prompt: 'нов___ книга', answer: 'ая', explanation_uz: 'ж → новая.' },
      { id: 'm6-agr-2', type: 'fillBlank', prompt: 'нов___ дом', answer: 'ый', explanation_uz: 'м → новый.' },
      { id: 'm6-agr-3', type: 'fillBlank', prompt: 'нов___ окно', answer: 'ое', explanation_uz: 'с → новое.' },
      { id: 'm6-agr-4', type: 'fillBlank', prompt: 'нов___ машины', answer: 'ые', explanation_uz: "ko'plik → новые." },
      { id: 'm6-agr-5', type: 'choose', prompt: "To'g'ri birikmani tanlang:", answer: 'большой город', choices: ['большой город', 'большая город', 'большое город', 'большый город'], explanation_uz: 'город м, urg‘u oxirida → большой.' },
      { id: 'm6-agr-6', type: 'transform', prompt: 'Moslang: «Я читаю (интересный) книгу»', answer: 'интересную', explanation_uz: 'В.п ж → -ую.' },
      { id: 'm6-agr-7', type: 'transform', prompt: 'Moslang: «Мы живём в (новый) доме»', answer: 'новом', explanation_uz: 'П.п м → -ом.' },
      { id: 'm6-agr-8', type: 'errorHunt', prompt: 'Xatoni toping: «У неё красивая глаза»', answer: 'У неё красивые глаза', explanation_uz: "глаза ko'plik → красивые." },
      { id: 'm6-agr-9', type: 'translate', prompt: 'Tarjima qiling: «mazali choy» (вкусный, чай)', answer: 'вкусный чай', explanation_uz: 'чай м → вкусный.' },
      { id: 'm6-agr-10', type: 'fillBlank', prompt: 'син___ море', answer: 'ее', explanation_uz: 'Yumshoq turdagi sifat с → синее.' },
    ],
  },
  {
    id: 'm6-short-form',
    module: 6,
    order: 2,
    level: 'A2',
    title: 'Qisqa shakl: рад, готов, должен',
    subtitle: 'Я рад. Она готова. Мы должны.',
    theory: [
      {
        heading: 'Qisqa shakl nima',
        body: "Ba'zi sifatlar kesim vazifasida qisqa shaklda ishlatiladi: готов (tayyor), рад (xursand), занят (band), болен (kasal), должен (kerak/qarzdor), нужен (kerak), свободен (bo'sh).",
        table: [
          ['', 'м', 'ж', 'с', "ko'plik"],
          ['tayyor', 'гото́в', 'гото́ва', 'гото́во', 'гото́вы'],
          ['band', 'за́нят', 'занята́', 'за́нято', 'за́няты'],
          ['kerak (shaxs)', 'до́лжен', 'должна́', 'должно́', 'должны́'],
          ['xursand', 'рад', 'ра́да', 'ра́до', 'ра́ды'],
        ],
      },
      {
        heading: 'должен + infinitiv',
        body: "Majburiyat: Я должен работать (ishlashim kerak). Rodga moslashadi: Она должна идти. Мы должны учиться.",
      },
      {
        heading: 'нужен qolipi',
        body: "Kerak bo'lgan NARSA ega bo'ladi: Мне нужен телефон (м), Мне нужна ручка (ж), Мне нужно время (с), Мне нужны деньги (ko'plik).",
      },
    ],
    comparisonWithUzbek:
      "'Men ishlashim kerak' = Я должен работать (kim kerakligi — rodda). 'Menga telefon kerak' = Мне нужен телефон — bu yerda нужен telefonga (narsaga) moslashadi, o'zbekchadagidek o'zgarmas emas.",
    examples: [
      { ru: 'Я гото́в.', uz: 'Men tayyorman.' },
      { ru: 'Она́ за́нята.', uz: 'U band.' },
      { ru: 'Мы должны́ мно́го рабо́тать.', uz: 'Biz ko‘p ishlashimiz kerak.' },
      { ru: 'Мне ну́жен слова́рь.', uz: 'Menga lug‘at kerak.' },
      { ru: 'Мне нужна́ по́мощь.', uz: 'Menga yordam kerak.' },
      { ru: 'Рад познако́миться!', uz: 'Tanishganimdan xursandman!' },
    ],
    commonMistakes: [
      { wrong: 'Она должен идти', right: 'Она должна идти', why_uz: 'должен rodga moslashadi.' },
      { wrong: 'Мне нужен помощь', right: 'Мне нужна помощь', why_uz: 'помощь ж → нужна.' },
      { wrong: 'Я есть готовый', right: 'Я готов', why_uz: 'Kesim vazifasida qisqa shakl.' },
    ],
    exercises: [
      { id: 'm6-sf-1', type: 'fillBlank', prompt: 'Она готов___ к экзамену.', answer: 'а', explanation_uz: 'ж → готова.' },
      { id: 'm6-sf-2', type: 'fillBlank', prompt: 'Мы должн___ помочь.', answer: 'ы', explanation_uz: "ko'plik → должны." },
      { id: 'm6-sf-3', type: 'choose', prompt: 'Мне ___ ручка. (kerak)', answer: 'нужна', choices: ['нужна', 'нужен', 'нужно', 'нужны'], explanation_uz: 'ручка ж → нужна.' },
      { id: 'm6-sf-4', type: 'choose', prompt: 'Мне ___ деньги.', answer: 'нужны', choices: ['нужны', 'нужен', 'нужна', 'нужно'], explanation_uz: "деньги ko'plik → нужны." },
      { id: 'm6-sf-5', type: 'translate', prompt: 'Tarjima qiling: «Men ketishim kerak» (erkak)', answer: 'Я должен идти', explanation_uz: 'должен + infinitiv.' },
      { id: 'm6-sf-6', type: 'errorHunt', prompt: 'Xatoni toping: «Извини, я занятый»', answer: 'Извини, я занят', explanation_uz: "Kesimda qisqa shakl: занят." },
      { id: 'm6-sf-7', type: 'fillBlank', prompt: 'Мне нужн___ время.', answer: 'о', explanation_uz: 'время с → нужно.' },
      { id: 'm6-sf-8', type: 'translate', prompt: 'Tarjima qiling: «U (ayol) band»', answer: 'Она занята', explanation_uz: 'занята.' },
    ],
  },
  {
    id: 'm6-comparative',
    module: 6,
    order: 3,
    level: 'A2',
    title: 'Qiyosiy daraja',
    subtitle: 'больше, лучше, интереснее',
    theory: [
      {
        heading: 'Yasalishi',
        body: "Oddiy usul: asos + -ее: интересный → интереснее, красивый → красивее. Yoki более + sifat: более интересный.",
        table: [
          ['Sifat', 'Qiyosiy', "Ma'no"],
          ['хоро́ший', 'лу́чше', 'yaxshiroq'],
          ['плохо́й', 'ху́же', 'yomonroq'],
          ['большо́й', 'бо́льше', 'kattaroq/ko‘proq'],
          ['ма́ленький', 'ме́ньше', 'kichikroq/kamroq'],
          ['ста́рый', 'ста́рше', 'kattaroq (yosh)'],
          ['молодо́й', 'моло́же', 'yoshroq'],
          ['дорого́й', 'доро́же', 'qimmatroq'],
          ['дешёвый', 'деше́вле', 'arzonroq'],
        ],
      },
      {
        heading: 'Solishtirish: чем yoki Р.п',
        body: "Ikki usul: 1) чем bilan: Москва больше, чем Ташкент. 2) Р.п bilan: Москва больше Ташкента. Ikkalasi ham to'g'ri.",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha '-roq' ga mos: kattaROQ = больше, yaxshiROQ = лучше. 'X dan kattaroq' = больше, чем X yoki больше X-a (Р.п) — '-dan' aynan Р.п ga mos keladi.",
    examples: [
      { ru: 'Э́тот фильм интере́снее.', uz: 'Bu film qiziqarliroq.' },
      { ru: 'Сего́дня тепле́е, чем вчера́.', uz: 'Bugun kechagidan iliqroq.' },
      { ru: 'Брат ста́рше меня́.', uz: 'Akam mendan katta.', note: 'Р.п usuli' },
      { ru: 'Э́то сто́ит доро́же.', uz: 'Bu qimmatroq turadi.' },
      { ru: 'Говори́ гро́мче!', uz: 'Balandroq gapir!' },
    ],
    commonMistakes: [
      { wrong: 'более лучше', right: 'лучше', why_uz: "более maxsus shakllar bilan qo'shilmaydi." },
      { wrong: 'хорошее (yaxshiroq ma’nosida)', right: 'лучше', why_uz: 'хороший ning qiyosiy darajasi maxsus: лучше.' },
      { wrong: 'старше чем меня', right: 'старше меня / старше, чем я', why_uz: 'чем dan keyin И.п, чем siz Р.п.' },
    ],
    exercises: [
      { id: 'm6-cmp-1', type: 'transform', prompt: 'Qiyosiy daraja: хороший', answer: 'лучше', explanation_uz: 'Maxsus shakl.' },
      { id: 'm6-cmp-2', type: 'transform', prompt: 'Qiyosiy daraja: большой', answer: 'больше', explanation_uz: 'больше.' },
      { id: 'm6-cmp-3', type: 'transform', prompt: 'Qiyosiy daraja: интересный', answer: 'интереснее', explanation_uz: '-ее bilan.' },
      { id: 'm6-cmp-4', type: 'choose', prompt: 'Akam mendan katta: «Брат ___ меня»', answer: 'старше', choices: ['старше', 'старее', 'более старый', 'старший'], explanation_uz: 'старше + Р.п.' },
      { id: 'm6-cmp-5', type: 'transform', prompt: 'Qiyosiy daraja: дорогой', answer: 'дороже', explanation_uz: 'г→ж: дороже.' },
      { id: 'm6-cmp-6', type: 'errorHunt', prompt: 'Xatoni toping: «Этот фильм более лучше»', answer: 'Этот фильм лучше', explanation_uz: 'более + лучше birga kelmaydi.' },
      { id: 'm6-cmp-7', type: 'translate', prompt: 'Tarjima qiling: «Bugun kechagidan sovuqroq» (холодно)', answer: 'Сегодня холоднее, чем вчера', explanation_uz: 'холоднее.' },
      { id: 'm6-cmp-8', type: 'choose', prompt: '«arzonroq» qanday?', answer: 'дешевле', choices: ['дешевле', 'дешевее', 'более дёшево', 'дешевше'], explanation_uz: 'дешёвый → дешевле.' },
    ],
  },
  {
    id: 'm6-superlative',
    module: 6,
    order: 4,
    level: 'A2',
    title: 'Orttirma daraja',
    subtitle: 'самый большой, лучший',
    theory: [
      {
        heading: 'самый + sifat',
        body: "Eng keng tarqalgan usul: самый (eng) + to'liq sifat, ikkalasi ham otga moslashadi: самый большой город, самая красивая девушка, самое высокое здание.",
      },
      {
        heading: 'Maxsus shakllar',
        body: "лучший (eng yaxshi), худший (eng yomon), старший (katta — oila a'zosi), младший (kichik): мой лучший друг, старший брат.",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha 'eng' = самый. Tartib bir xil: 'eng katta uy' = самый большой дом. Faqat самый ham sifatdek moslashishini unutmang.",
    examples: [
      { ru: 'Э́то са́мый большо́й го́род.', uz: 'Bu eng katta shahar.' },
      { ru: 'Она́ са́мая у́мная в кла́ссе.', uz: 'U sinfda eng aqllisi.' },
      { ru: 'Мой лу́чший друг живёт в Москве́.', uz: 'Eng yaqin do‘stim Moskvada yashaydi.' },
      { ru: 'ста́рший брат', uz: 'katta aka', note: 'oilada' },
    ],
    commonMistakes: [
      { wrong: 'самый лучше', right: 'самый лучший / лучше всех', why_uz: 'самый + to‘liq shakl.' },
      { wrong: 'самая большой город', right: 'самый большой город', why_uz: 'самый ham otga moslashadi: город м.' },
    ],
    exercises: [
      { id: 'm6-sup-1', type: 'fillBlank', prompt: 'Это сам___ красивая площадь.', answer: 'ая', explanation_uz: 'площадь ж → самая.' },
      { id: 'm6-sup-2', type: 'choose', prompt: '«eng yaxshi do‘st» qanday?', answer: 'лучший друг', choices: ['лучший друг', 'самый лучше друг', 'более хороший друг', 'наилучше друг'], explanation_uz: 'лучший — maxsus shakl.' },
      { id: 'm6-sup-3', type: 'translate', prompt: 'Tarjima qiling: «Bu eng qimmat restoran» (дорогой, ресторан)', answer: 'Это самый дорогой ресторан', explanation_uz: 'самый дорогой.' },
      { id: 'm6-sup-4', type: 'choose', prompt: '«katta aka» (oilada)?', answer: 'старший брат', choices: ['старший брат', 'самый старый брат', 'старше брат', 'большой брат'], explanation_uz: 'Oilada: старший/младший.' },
      { id: 'm6-sup-5', type: 'errorHunt', prompt: 'Xatoni toping: «Это самая высокое здание»', answer: 'Это самое высокое здание', explanation_uz: 'здание с → самое.' },
    ],
  },
  {
    id: 'm6-adverbs',
    module: 6,
    order: 5,
    level: 'A2',
    title: 'Ravishlar',
    subtitle: 'хорошо, быстро, по-русски',
    theory: [
      {
        heading: 'Yasalishi',
        body: "Ko'p ravishlar sifatdan -о bilan yasaladi: хороший → хорошо, быстрый → быстро, плохой → плохо. Tillar uchun по- + -ски: по-русски, по-узбекски.",
        table: [
          ['Sifat', 'Ravish', "Ma'no"],
          ['бы́стрый', 'бы́стро', 'tez'],
          ['ме́дленный', 'ме́дленно', 'sekin'],
          ['хоро́ший', 'хорошо́', 'yaxshi'],
          ['громкий', 'гро́мко', 'baland (ovoz)'],
          ['ру́сский', 'по-ру́сски', 'ruscha'],
        ],
      },
      {
        heading: 'тоже va также',
        body: "тоже — 'ham' (ega o'xshash): Я тоже студент. также — 'shuningdek' (ish-harakat qo'shiladi): Он играет на гитаре, а также поёт.",
      },
      {
        heading: 'Holat gaplari',
        body: "Ravish + Д.п shaxs holatni bildiradi: Мне холодно (menga sovuq), Ему скучно (unga zerikarli), Нам весело (bizga quvnoq).",
      },
    ],
    comparisonWithUzbek:
      "'Ruscha gapiraman' = говорю по-русски (по- bilan!). 'Menga sovuq' = Мне холодно — qolip o'zbekchadagi bilan bir xil (kimga + holat).",
    examples: [
      { ru: 'Он бы́стро говори́т.', uz: 'U tez gapiradi.' },
      { ru: 'Я хорошо́ говорю́ по-ру́сски.', uz: 'Men ruscha yaxshi gapiraman.' },
      { ru: 'Говори́те ме́дленнее, пожа́луйста.', uz: 'Sekinroq gapiring, iltimos.' },
      { ru: 'Мне хо́лодно.', uz: 'Menga sovuq. / Sovqotyapman.' },
      { ru: 'Я то́же хочу́ чай.', uz: 'Men ham choy xohlayman.' },
    ],
    commonMistakes: [
      { wrong: 'говорю русский', right: 'говорю по-русски', why_uz: "Tilda gapirish — по-русски; русский язык — tilning o'zi." },
      { wrong: 'Я холодный (sovqotdim ma’nosida)', right: 'Мне холодно', why_uz: 'Holat — Д.п + ravish.' },
      { wrong: 'Он говорит хороший', right: 'Он говорит хорошо', why_uz: "Fe'lni ravish aniqlaydi: хорошо." },
    ],
    exercises: [
      { id: 'm6-adv-1', type: 'transform', prompt: 'Ravish yasang: быстрый', answer: 'быстро', explanation_uz: '-о bilan.' },
      { id: 'm6-adv-2', type: 'fillBlank', prompt: 'Я говорю ___-русски.', answer: 'по', explanation_uz: 'по-русски.' },
      { id: 'm6-adv-3', type: 'choose', prompt: '«Menga sovuq» qanday?', answer: 'Мне холодно', choices: ['Мне холодно', 'Я холодный', 'Я холодно', 'Мне холодный'], explanation_uz: 'Д.п + ravish.' },
      { id: 'm6-adv-4', type: 'choose', prompt: 'Я ___ студент. (ham)', answer: 'тоже', choices: ['тоже', 'также', 'и', 'ещё'], explanation_uz: 'тоже — ham.' },
      { id: 'm6-adv-5', type: 'errorHunt', prompt: 'Xatoni toping: «Она поёт хорошая»', answer: 'Она поёт хорошо', explanation_uz: "Fe'l + ravish: хорошо." },
      { id: 'm6-adv-6', type: 'translate', prompt: 'Tarjima qiling: «Sekinroq gapiring, iltimos»', answer: 'Говорите медленнее, пожалуйста', explanation_uz: 'медленнее — qiyosiy ravish.' },
      { id: 'm6-adv-7', type: 'fillBlank', prompt: 'Ему ску___. (zerikarli)', answer: 'чно', explanation_uz: 'Ему скучно.' },
    ],
  },
];
