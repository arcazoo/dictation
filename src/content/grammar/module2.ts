import type { GrammarTopic } from '../../types';

/** Modul 2 — Ot: rod, ko'plik, jonlilik, egalik olmoshlari (A1) */
export const MODULE_2: GrammarTopic[] = [
  {
    id: 'm2-gender',
    module: 2,
    order: 1,
    level: 'A1',
    title: 'Rod: мужской, женский, средний',
    subtitle: "Oxirgi harfga qarab aniqlash",
    theory: [
      {
        heading: 'Asosiy qoida',
        body: "Otning rodini oxirgi harfidan aniqlaymiz. Bu rus grammatikasining poydevori — sifat, fe'l (o'tgan zamon) va olmoshlar rodga moslashadi.",
        table: [
          ['Rod', 'Oxiri', 'Misollar'],
          ['мужской (он)', 'undosh, -й, ba’zi -ь', 'стол, музей, словарь'],
          ['женский (она)', '-а, -я, ba’zi -ь', 'книга, неделя, ночь'],
          ['средний (оно)', '-о, -е, -мя', 'окно, море, время'],
        ],
      },
      {
        heading: 'Istisnolar',
        body: "1) Erkak kishini bildiruvchi -а/-я li so'zlar мужской: папа, дедушка, дядя, мужчина. 2) кофе — мужской (у kirib kelgan so'z). 3) время, имя — средний (-мя). 4) -ь bilan tugaganlar lug'atdan yodlanadi: день (м), ночь (ж), словарь (м), тетрадь (ж).",
      },
    ],
    comparisonWithUzbek:
      "O'zbek tilida rod tushunchasi umuman yo'q — bu ruschadagi eng katta yangi odat. Har yangi otni rodi bilan birga yodlang: 'книга — она', 'стол — он' deb.",
    examples: [
      { ru: 'стол — он', uz: 'stol', note: 'undosh bilan tugadi → м' },
      { ru: 'кни́га — она́', uz: 'kitob', note: '-а → ж' },
      { ru: 'окно́ — оно́', uz: 'deraza', note: '-о → с' },
      { ru: 'па́па — он', uz: 'dada', note: "istisno: erkak kishi" },
      { ru: 'ночь — она́', uz: 'tun', note: '-ь, ammo ж' },
      { ru: 'вре́мя — оно́', uz: 'vaqt', note: '-мя → с' },
      { ru: 'ко́фе — он', uz: 'kofe', note: 'istisno' },
    ],
    commonMistakes: [
      { wrong: 'папа — она', right: 'папа — он', why_uz: "-а bilan tugasa ham erkak kishini bildirgani uchun мужской." },
      { wrong: 'кофе — оно', right: 'кофе — он', why_uz: "кофе istisno tarzda мужской: вкусный кофе." },
      { wrong: 'время — она', right: 'время — оно', why_uz: '-мя bilan tugagan 10 ta ot средний rod.' },
    ],
    exercises: [
      { id: 'm2-gen-1', type: 'caseDetector', prompt: 'книга — qaysi rod?', answer: 'женский', choices: ['мужской', 'женский', 'средний'], explanation_uz: '-а bilan tugaydi → женский.' },
      { id: 'm2-gen-2', type: 'caseDetector', prompt: 'стол — qaysi rod?', answer: 'мужской', choices: ['мужской', 'женский', 'средний'], explanation_uz: 'Undosh bilan tugaydi → мужской.' },
      { id: 'm2-gen-3', type: 'caseDetector', prompt: 'окно — qaysi rod?', answer: 'средний', choices: ['мужской', 'женский', 'средний'], explanation_uz: '-о → средний.' },
      { id: 'm2-gen-4', type: 'caseDetector', prompt: 'папа — qaysi rod?', answer: 'мужской', choices: ['мужской', 'женский', 'средний'], explanation_uz: 'Erkak kishini bildiradi → мужской (istisno).' },
      { id: 'm2-gen-5', type: 'caseDetector', prompt: 'время — qaysi rod?', answer: 'средний', choices: ['мужской', 'женский', 'средний'], explanation_uz: '-мя bilan tugagan otlar средний.' },
      { id: 'm2-gen-6', type: 'caseDetector', prompt: 'ночь — qaysi rod?', answer: 'женский', choices: ['мужской', 'женский', 'средний'], explanation_uz: 'ночь — ж (yodlash kerak), день — м.' },
      { id: 'm2-gen-7', type: 'caseDetector', prompt: 'музей — qaysi rod?', answer: 'мужской', choices: ['мужской', 'женский', 'средний'], explanation_uz: '-й bilan tugaydi → мужской.' },
      { id: 'm2-gen-8', type: 'caseDetector', prompt: 'кофе — qaysi rod?', answer: 'мужской', choices: ['мужской', 'женский', 'средний'], explanation_uz: 'кофе — istisno, мужской.' },
      { id: 'm2-gen-9', type: 'fillBlank', prompt: 'кни́га — он___ (olmosh)', answer: 'а', explanation_uz: 'книга → она.' },
      { id: 'm2-gen-10', type: 'choose', prompt: 'Qaysi qatorda hammasi женский rod?', answer: 'мама, неделя, ночь', choices: ['мама, неделя, ночь', 'стол, книга, окно', 'папа, мама, море', 'день, ночь, время'], explanation_uz: 'мама (-а), неделя (-я), ночь (ж istisno).' },
    ],
  },
  {
    id: 'm2-plural',
    module: 2,
    order: 2,
    level: 'A1',
    title: "Ko'plik shakli",
    subtitle: 'столы, книги, окна',
    theory: [
      {
        heading: 'Asosiy qoidalar',
        body: "Ko'plik yasash rodga va oxirgi harfga bog'liq.",
        table: [
          ['Birlik', "Ko'plik", 'Qoida'],
          ['стол', 'столы́', 'qattiq undosh → -ы'],
          ['кни́га', 'кни́ги', 'г,к,х,ж,ш,ч,щ dan keyin → -и'],
          ['музе́й', 'музе́и', '-й → -и'],
          ['слова́рь', 'словари́', '-ь → -и'],
          ['окно́', 'о́кна', '-о → -а'],
          ['мо́ре', 'моря́', '-е → -я'],
        ],
      },
      {
        heading: 'Muhim istisnolar',
        body: "человек → люди (odamlar), ребёнок → дети (bolalar), друг → друзья, брат → братья, стул → стулья, дом → дома́, город → города́, глаз → глаза́. Ba'zi so'zlar faqat ko'plikda: деньги (pul), очки (ko'zoynak), часы (soat).",
      },
    ],
    comparisonWithUzbek:
      "O'zbek tilida bitta universal '-lar' bor. Rus tilida qo'shimcha rod va oxirgi tovushga qarab tanlanadi, urg'u ham ko'chishi mumkin (стол → столы́).",
    examples: [
      { ru: 'стол → столы́', uz: 'stol → stollar' },
      { ru: 'кни́га → кни́ги', uz: 'kitob → kitoblar', note: 'г dan keyin -и' },
      { ru: 'окно́ → о́кна', uz: 'deraza → derazalar', note: "urg'u ko'chdi" },
      { ru: 'челове́к → лю́ди', uz: 'odam → odamlar', note: 'istisno!' },
      { ru: 'ребёнок → де́ти', uz: 'bola → bolalar', note: 'istisno!' },
      { ru: 'друг → друзья́', uz: "do'st → do'stlar", note: 'istisno' },
      { ru: 'го́род → города́', uz: 'shahar → shaharlar', note: '-а bilan' },
    ],
    commonMistakes: [
      { wrong: 'человеки', right: 'люди', why_uz: "человек ko'pligi mutlaqo boshqa so'z: люди." },
      { wrong: 'ребёнки', right: 'дети', why_uz: 'ребёнок → дети (istisno).' },
      { wrong: 'книгы', right: 'книги', why_uz: 'г, к, х dan keyin ы emas, и yoziladi.' },
      { wrong: 'окны', right: 'окна', why_uz: "O'rta rod -о → -а bo'ladi." },
    ],
    exercises: [
      { id: 'm2-pl-1', type: 'transform', prompt: "Ko'plikka o'tkazing: стол", answer: 'столы', explanation_uz: 'стол → столы́.' },
      { id: 'm2-pl-2', type: 'transform', prompt: "Ko'plikka o'tkazing: книга", answer: 'книги', explanation_uz: 'г dan keyin -и: книги.' },
      { id: 'm2-pl-3', type: 'transform', prompt: "Ko'plikka o'tkazing: окно", answer: 'окна', explanation_uz: 'окно → о́кна.' },
      { id: 'm2-pl-4', type: 'transform', prompt: "Ko'plikka o'tkazing: человек", answer: 'люди', explanation_uz: 'Istisno: человек → люди.' },
      { id: 'm2-pl-5', type: 'transform', prompt: "Ko'plikka o'tkazing: ребёнок", answer: 'дети', explanation_uz: 'Istisno: ребёнок → дети.' },
      { id: 'm2-pl-6', type: 'transform', prompt: "Ko'plikka o'tkazing: друг", answer: 'друзья', explanation_uz: 'друг → друзья́.' },
      { id: 'm2-pl-7', type: 'transform', prompt: "Ko'plikka o'tkazing: словарь", answer: 'словари', explanation_uz: '-ь → -и: словари́.' },
      { id: 'm2-pl-8', type: 'choose', prompt: "Qaysi so'z faqat ko'plikda ishlatiladi?", answer: 'деньги', choices: ['деньги', 'дом', 'мама', 'город'], explanation_uz: "деньги (pul) birlikda ishlatilmaydi." },
      { id: 'm2-pl-9', type: 'transform', prompt: "Ko'plikka o'tkazing: город", answer: 'города', explanation_uz: 'город → города́ (-а bilan).' },
      { id: 'm2-pl-10', type: 'errorHunt', prompt: 'Xatoni toping: «В классе пять человеки»', answer: 'В классе пять человек', explanation_uz: "Sanoqdan keyin человек o'zgarmaydi: пять человек." },
    ],
  },
  {
    id: 'm2-animacy',
    module: 2,
    order: 3,
    level: 'A1',
    title: 'Jonli va jonsiz otlar',
    subtitle: 'кто? — что?',
    theory: [
      {
        heading: 'Nega kerak',
        body: "Rus tilida otlar jonli (одушевлённые — odamlar, hayvonlar) va jonsiz (неодушевлённые) ga bo'linadi. Jonlilarga savol: кто? (kim?), jonsizlarga: что? (nima?). Diqqat: rus tilida hayvonlar ham кто!",
      },
      {
        heading: "Tushum kelishigiga ta'siri",
        body: "Bu farq винительный падеж (tushum kelishigi)da muhim: jonli мужской otlar родительный shaklini oladi: Я вижу стол (jonsiz, o'zgarmadi) — Я вижу брата (jonli, брат → брата).",
        table: [
          ['', 'Jonsiz', 'Jonli'],
          ['Bosh kelishik', 'стол', 'брат'],
          ['Tushum (вижу...)', 'стол', 'бра́та'],
        ],
      },
    ],
    comparisonWithUzbek:
      "O'zbek tilida 'kim' faqat odamga, hayvonga 'nima' deyiladi. Rus tilida esa mushuk ham, qush ham кто. Tushumdagi -а o'zgarishi o'zbekcha '-ni' ga o'xshab ishlaydi, lekin faqat jonli erkak rodda ko'rinadi.",
    examples: [
      { ru: 'Кто э́то? — Э́то ко́шка.', uz: 'Bu kim? — Bu mushuk.', note: 'hayvon ham кто!' },
      { ru: 'Что э́то? — Э́то стол.', uz: 'Bu nima? — Bu stol.' },
      { ru: 'Я ви́жу дом.', uz: "Men uyni ko'ryapman.", note: "jonsiz — o'zgarmaydi" },
      { ru: 'Я ви́жу бра́та.', uz: "Men akamni ko'ryapman.", note: 'jonli м → -а' },
      { ru: 'Он зна́ет Ива́на.', uz: 'U Ivanni biladi.' },
    ],
    commonMistakes: [
      { wrong: 'Что это? (mushuk haqida)', right: 'Кто это?', why_uz: 'Rus tilida hayvonlar jonli hisoblanadi — кто.' },
      { wrong: 'Я вижу брат', right: 'Я вижу брата', why_uz: 'Jonli мужской ot tushumda -а oladi.' },
    ],
    exercises: [
      { id: 'm2-an-1', type: 'choose', prompt: 'собака (it) haqida qanday so‘raladi?', answer: 'Кто это?', choices: ['Кто это?', 'Что это?', 'Где это?', 'Как это?'], explanation_uz: 'Hayvonlar ham кто.' },
      { id: 'm2-an-2', type: 'choose', prompt: 'машина haqida qanday so‘raladi?', answer: 'Что это?', choices: ['Что это?', 'Кто это?', 'Куда это?', 'Чей это?'], explanation_uz: 'Jonsiz predmet — что.' },
      { id: 'm2-an-3', type: 'fillBlank', prompt: 'Я вижу брат___. (aka)', answer: 'а', explanation_uz: 'Jonli м ot tushumda: брата.' },
      { id: 'm2-an-4', type: 'choose', prompt: '«Я вижу ...» — стол so‘zi qanday shaklda bo‘ladi?', answer: 'стол (o‘zgarmaydi)', choices: ['стол (o‘zgarmaydi)', 'стола', 'столу', 'столом'], explanation_uz: "Jonsiz м ot tushumda o'zgarmaydi: вижу стол." },
      { id: 'm2-an-5', type: 'transform', prompt: 'Tushum kelishigiga qo‘ying: «Иван» (Я знаю ...)', answer: 'Ивана', explanation_uz: 'Jonli ism: Ивана.' },
      { id: 'm2-an-6', type: 'translate', prompt: 'Tarjima qiling: «Men itni ko‘ryapman» (собака)', answer: 'Я вижу собаку', explanation_uz: 'ж rod tushumda -у: собаку.' },
      { id: 'm2-an-7', type: 'errorHunt', prompt: 'Xatoni toping: «Я вижу друг»', answer: 'Я вижу друга', explanation_uz: 'друг jonli → друга.' },
    ],
  },
  {
    id: 'm2-possessive',
    module: 2,
    order: 4,
    level: 'A1',
    title: 'Egalik olmoshlari',
    subtitle: 'мой, моя, моё, мои',
    theory: [
      {
        heading: 'Rodga moslashish',
        body: "Egalik olmoshi egalik qilinayotgan narsaning rodiga moslashadi (egasiga emas!): мой стол, моя книга, моё окно, мои книги.",
        table: [
          ['', 'м', 'ж', 'с', "ko'plik"],
          ['mening', 'мой', 'моя́', 'моё', 'мои́'],
          ['sening', 'твой', 'твоя́', 'твоё', 'твои́'],
          ['bizning', 'наш', 'на́ша', 'на́ше', 'на́ши'],
          ['sizning', 'ваш', 'ва́ша', 'ва́ше', 'ва́ши'],
        ],
      },
      {
        heading: "O'zgarmaydiganlar",
        body: "его́ (uning — erkak), её (uning — ayol), их (ularning) hech qachon o'zgarmaydi: его дом, его книга, его окна.",
      },
      {
        heading: 'Savol: чей?',
        body: "Kimniki? savoli ham rodga moslashadi: чей (м), чья (ж), чьё (с), чьи (ko'plik). Чья это книга? — Моя.",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha 'mening' har doim bir xil, ruscha мой/моя/моё/мои narsaning rodiga qarab tanlanadi. Lekin его/её/их — o'zbekchadagidek o'zgarmas, bu oson.",
    examples: [
      { ru: 'мой брат', uz: 'mening akam' },
      { ru: 'моя́ сестра́', uz: 'mening singlim' },
      { ru: 'моё окно́', uz: 'mening derazam' },
      { ru: 'мои́ роди́тели', uz: 'mening ota-onam' },
      { ru: 'его́ маши́на', uz: 'uning mashinasi', note: "его o'zgarmaydi" },
      { ru: 'Чья э́то кни́га? — Моя́.', uz: 'Bu kimning kitobi? — Meniki.' },
    ],
    commonMistakes: [
      { wrong: 'мой книга', right: 'моя книга', why_uz: 'книга — ж rod, shuning uchun моя.' },
      { wrong: 'евоный / еёный', right: 'его / её', why_uz: "его/её ga qo'shimcha qo'shilmaydi — ular o'zgarmas." },
      { wrong: 'наша окно', right: 'наше окно', why_uz: "окно — с rod → наше." },
    ],
    exercises: [
      { id: 'm2-poss-1', type: 'fillBlank', prompt: '___ книга (mening)', answer: 'моя', explanation_uz: 'книга ж → моя.' },
      { id: 'm2-poss-2', type: 'fillBlank', prompt: '___ стол (mening)', answer: 'мой', explanation_uz: 'стол м → мой.' },
      { id: 'm2-poss-3', type: 'fillBlank', prompt: '___ окно (bizning)', answer: 'наше', explanation_uz: 'окно с → наше.' },
      { id: 'm2-poss-4', type: 'fillBlank', prompt: '___ родители (sening)', answer: 'твои', explanation_uz: "ko'plik → твои." },
      { id: 'm2-poss-5', type: 'choose', prompt: "«uning (ayol) kitobi» qanday bo'ladi?", answer: 'её книга', choices: ['её книга', 'еёная книга', 'его книга', 'ей книга'], explanation_uz: "её o'zgarmaydi." },
      { id: 'm2-poss-6', type: 'fillBlank', prompt: '___ это машина? — Это машина брата.', answer: 'Чья', explanation_uz: 'машина ж → чья.' },
      { id: 'm2-poss-7', type: 'errorHunt', prompt: 'Xatoni toping: «Это мой сестра»', answer: 'Это моя сестра', explanation_uz: 'сестра ж → моя.' },
      { id: 'm2-poss-8', type: 'translate', prompt: 'Tarjima qiling: «Bizning uyimiz katta» (дом, большой)', answer: 'Наш дом большой', explanation_uz: 'дом м → наш.' },
      { id: 'm2-poss-9', type: 'sentenceBuilder', prompt: 'Gap tuzing: «Bu mening kitobim»', answer: 'Это моя книга', tokens: ['книга', 'моя', 'Это'], explanation_uz: 'Это моя книга.' },
    ],
  },
];
