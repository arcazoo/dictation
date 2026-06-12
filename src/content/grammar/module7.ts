import type { GrammarTopic } from '../../types';

/** Modul 7 — Sintaksis: savollar, который, bog'lovchilar, sonlar, modallar (A2-B1) */
export const MODULE_7: GrammarTopic[] = [
  {
    id: 'm7-questions',
    module: 7,
    order: 1,
    level: 'A2',
    title: "So'roq so'zlari to'liq",
    subtitle: 'почему, зачем, сколько, какой',
    theory: [
      {
        heading: "To'liq ro'yxat",
        body: "Asosiy so'roq so'zlari va nozik farqlar:",
        table: [
          ["So'z", "Ma'no", 'Misol'],
          ['кто / что', 'kim / nima', 'Кто звони́л?'],
          ['где / куда́ / отку́да', 'qayerda / qayerga / qayerdan', 'Отку́да вы?'],
          ['когда́', 'qachon', 'Когда́ начнётся?'],
          ['почему́', 'nima uchun (sabab)', 'Почему́ ты опозда́л?'],
          ['заче́м', 'nima maqsadda', 'Заче́м тебе́ э́то?'],
          ['ско́лько', 'qancha/nechta', 'Ско́лько сто́ит?'],
          ['како́й/кака́я/како́е', 'qanday/qaysi', 'Како́й цвет?'],
          ['чей/чья/чьё', 'kimniki', 'Чья э́то су́мка?'],
          ['как', 'qanday qilib', 'Как дое́хать до...?'],
        ],
      },
      {
        heading: 'почему vs зачем',
        body: "почему — sabab so'raydi (nega shunday bo'ldi?), зачем — maqsad so'raydi (nima uchun kerak?). Почему ты грустный? — Зачем ты купил это?",
      },
      {
        heading: 'какой moslashadi',
        body: "какой sifatdek rod/son/kelishikka moslashadi: Какой фильм? Какая музыка? Какое время? Какие книги? В каком городе ты живёшь?",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha 'nega' ikkala savolga ham ishlatiladi, ruscha почему (sabab) va зачем (maqsad) farqlanadi. 'Qanaqa/qaysi' = какой — moslashishini unutmang.",
    examples: [
      { ru: 'Почему́ ты не пришёл?', uz: 'Nega kelmading? (sabab)' },
      { ru: 'Заче́м тебе́ две маши́ны?', uz: 'Senga ikkita mashina nimaga kerak? (maqsad)' },
      { ru: 'Ско́лько вам лет?', uz: 'Yoshingiz nechada?' },
      { ru: 'Како́й твой люби́мый фильм?', uz: 'Sevimli filming qaysi?' },
      { ru: 'Отку́да вы прие́хали?', uz: 'Qayerdan keldingiz?' },
    ],
    commonMistakes: [
      { wrong: 'Куда ты живёшь?', right: 'Где ты живёшь?', why_uz: "Yashash — joy (где), yo'nalish emas." },
      { wrong: 'Какой музыка?', right: 'Какая музыка?', why_uz: 'музыка ж → какая.' },
      { wrong: 'Сколько лет вы?', right: 'Сколько вам лет?', why_uz: 'Yosh — Д.п: вам.' },
    ],
    exercises: [
      { id: 'm7-q-1', type: 'fillBlank', prompt: '___ вы приехали? — Из Ташкента.', answer: 'Откуда', explanation_uz: 'Javob «-dan» → откуда.' },
      { id: 'm7-q-2', type: 'choose', prompt: '«Nega yig‘layapsan?» (sabab)', answer: 'Почему ты плачешь?', choices: ['Почему ты плачешь?', 'Зачем ты плачешь?', 'Как ты плачешь?', 'Что ты плачешь?'], explanation_uz: 'Sabab → почему.' },
      { id: 'm7-q-3', type: 'fillBlank', prompt: '___ это стоит? — Сто рублей.', answer: 'Сколько', explanation_uz: 'Narx → сколько.' },
      { id: 'm7-q-4', type: 'fillBlank', prompt: '___ музыка тебе нравится?', answer: 'Какая', explanation_uz: 'музыка ж → какая.' },
      { id: 'm7-q-5', type: 'choose', prompt: '«Bu kimning telefoni?»', answer: 'Чей это телефон?', choices: ['Чей это телефон?', 'Чья это телефон?', 'Кто это телефон?', 'Какой это телефон?'], explanation_uz: 'телефон м → чей.' },
      { id: 'm7-q-6', type: 'errorHunt', prompt: 'Xatoni toping: «Куда находится банк?»', answer: 'Где находится банк?', explanation_uz: 'Joylashuv → где.' },
      { id: 'm7-q-7', type: 'translate', prompt: 'Tarjima qiling: «Qaysi shaharda yashaysiz?»', answer: 'В каком городе вы живёте?', explanation_uz: 'в каком — П.п.' },
      { id: 'm7-q-8', type: 'choose', prompt: '«Senga bu nimaga kerak?» (maqsad)', answer: 'Зачем тебе это?', choices: ['Зачем тебе это?', 'Почему тебе это?', 'Где тебе это?', 'Когда тебе это?'], explanation_uz: 'Maqsad → зачем.' },
    ],
  },
  {
    id: 'm7-kotoryj',
    module: 7,
    order: 2,
    level: 'B1',
    title: '«который» bilan ergash gaplar',
    subtitle: 'девушка, которая поёт',
    theory: [
      {
        heading: 'который nima',
        body: "O'zbekcha '-gan/-adigan' sifatdoshlariga mos: 'qo'shiq aytayotgan qiz' = девушка, которая поёт. который aniqlanayotgan otning rodi va soniga moslashadi, kelishigi esa ergash gapdagi vazifasiga qarab tanlanadi.",
        table: [
          ['Bosh gap', 'Ergash gap', 'Tarjima'],
          ['Вот дом,', 'кото́рый мы купи́ли', 'biz sotib olgan uy'],
          ['Вот де́вушка,', 'кото́рая рабо́тает со мной', 'men bilan ishlaydigan qiz'],
          ['Вот окно́,', 'кото́рое мы откры́ли', 'biz ochgan deraza'],
          ['Вот лю́ди,', 'кото́рые мне помогли́', 'menga yordam bergan odamlar'],
        ],
      },
      {
        heading: 'Kelishik ergash gapdan',
        body: "Книга, которую я читаю (men o'qiyotgan kitob — В.п, chunki читаю что?). Друг, которому я звонил (men qo'ng'iroq qilgan do'st — Д.п, chunki звонил кому?). Rod/son — otdan, kelishik — ergash gapdagi fe'ldan!",
      },
    ],
    comparisonWithUzbek:
      "O'zbek tilida sifatdosh otdan OLDIN keladi ('o'qiyotgan kitob'), rus tilida который otdan KEYIN: книга, которую я читаю. Vergul majburiy!",
    examples: [
      { ru: 'Я зна́ю челове́ка, кото́рый говори́т по-узбе́кски.', uz: 'O‘zbekcha gapiradigan odamni bilaman.' },
      { ru: 'Э́то фильм, кото́рый мне нра́вится.', uz: 'Bu menga yoqadigan film.' },
      { ru: 'Кни́га, кото́рую ты дал, о́чень интере́сная.', uz: 'Sen bergan kitob juda qiziqarli.' },
      { ru: 'Друг, с кото́рым я учи́лся, живёт в Москве́.', uz: 'Men birga o‘qigan do‘stim Moskvada yashaydi.' },
    ],
    commonMistakes: [
      { wrong: 'девушка, который поёт', right: 'девушка, которая поёт', why_uz: 'девушка ж → которая.' },
      { wrong: 'книга, которая я читаю', right: 'книга, которую я читаю', why_uz: "Ergash gapda 'nimani o'qiyapman' → В.п которую." },
      { wrong: 'vergulsiz yozish', right: 'otdan keyin vergul', why_uz: 'который oldidan doim vergul.' },
    ],
    exercises: [
      { id: 'm7-kot-1', type: 'fillBlank', prompt: 'Это дом, котор___ мы купили.', answer: 'ый', explanation_uz: 'дом м, В.п jonsiz → который.' },
      { id: 'm7-kot-2', type: 'fillBlank', prompt: 'Это девушка, котор___ работает в банке.', answer: 'ая', explanation_uz: 'девушка ж → которая.' },
      { id: 'm7-kot-3', type: 'fillBlank', prompt: 'Книга, котор___ я читаю, интересная.', answer: 'ую', explanation_uz: 'читаю что? → В.п которую.' },
      { id: 'm7-kot-4', type: 'fillBlank', prompt: 'Люди, котор___ здесь живут, очень добрые.', answer: 'ые', explanation_uz: "ko'plik → которые." },
      { id: 'm7-kot-5', type: 'choose', prompt: 'Друг, ___ я звонил, не ответил.', answer: 'которому', choices: ['которому', 'который', 'которого', 'котором'], explanation_uz: 'звонить кому → Д.п.' },
      { id: 'm7-kot-6', type: 'translate', prompt: 'Tarjima qiling: «Men ko‘rgan film yaxshi edi» (смотреть)', answer: 'Фильм, который я смотрел, был хороший', explanation_uz: 'фильм м → который.' },
      { id: 'm7-kot-7', type: 'errorHunt', prompt: 'Xatoni toping: «Это машина, который я хочу купить»', answer: 'Это машина, которую я хочу купить', explanation_uz: 'машина ж + В.п → которую.' },
    ],
  },
  {
    id: 'm7-conjunctions',
    module: 7,
    order: 3,
    level: 'B1',
    title: "Bog'lovchilar: чтобы, потому что, если",
    subtitle: 'Sabab, maqsad va shart',
    theory: [
      {
        heading: 'потому что va поэтому',
        body: "потому что — chunki (sababni keltiradi): Я не пришёл, потому что болел. поэтому — shuning uchun (natijani keltiradi): Я болел, поэтому не пришёл.",
      },
      {
        heading: 'чтобы — maqsad',
        body: "'... uchun' ma'nosida: Я учу русский, чтобы работать в России. Ega har xil bo'lsa чтобы + O'TGAN zamon: Я хочу, чтобы ты пришёл (kelishingni xohlayman).",
      },
      {
        heading: 'если — shart',
        body: "Real shart: Если будет время, я приду (vaqt bo'lsa kelaman — kelasi zamon!). Noreal shart: если бы + o'tgan zamon, бы bilan: Если бы у меня были деньги, я бы купил машину.",
      },
    ],
    comparisonWithUzbek:
      "'chunki' = потому что, 'shuning uchun' = поэтому, '-sa' (shart) = если, '-ish uchun' = чтобы + infinitiv. 'Kelishingni xohlayman' qolipida чтобы dan keyin o'tgan zamon kelishi — yangi qoida, yodlang!",
    examples: [
      { ru: 'Я учу́ ру́сский, потому́ что хочу́ рабо́тать в Росси́и.', uz: 'Rus tilini o‘rganyapman, chunki Rossiyada ishlamoqchiman.' },
      { ru: 'Шёл дождь, поэ́тому мы оста́лись до́ма.', uz: 'Yomg‘ir yog‘ayotgan edi, shuning uchun uyda qoldik.' },
      { ru: 'Я пришёл, что́бы помо́чь.', uz: 'Yordam berish uchun keldim.' },
      { ru: 'Я хочу́, что́бы ты позвони́л ма́ме.', uz: 'Onangga qo‘ng‘iroq qilishingni xohlayman.' },
      { ru: 'Е́сли за́втра бу́дет со́лнце, мы пойдём в парк.', uz: 'Ertaga quyosh bo‘lsa, parkka boramiz.' },
      { ru: 'Е́сли бы я знал, я бы сказа́л.', uz: 'Bilganimda aytardim.' },
    ],
    commonMistakes: [
      { wrong: 'Я хочу, чтобы ты придёшь', right: 'Я хочу, чтобы ты пришёл', why_uz: "чтобы dan keyin o'tgan zamon shakli." },
      { wrong: 'Если я буду иметь время... (kalka)', right: 'Если у меня будет время...', why_uz: "Egalik у + Р.п qolipida." },
      { wrong: 'потому va поэтому almashtirish', right: 'sabab→потому что, natija→поэтому', why_uz: "Yo'nalishi teskari ikki bog'lovchi." },
    ],
    exercises: [
      { id: 'm7-conj-1', type: 'choose', prompt: 'Я не пришёл, ___ болел.', answer: 'потому что', choices: ['потому что', 'поэтому', 'чтобы', 'если'], explanation_uz: 'Sabab → потому что.' },
      { id: 'm7-conj-2', type: 'choose', prompt: 'Я болел, ___ не пришёл.', answer: 'поэтому', choices: ['поэтому', 'потому что', 'чтобы', 'который'], explanation_uz: 'Natija → поэтому.' },
      { id: 'm7-conj-3', type: 'choose', prompt: 'Я учу русский, ___ работать в Москве.', answer: 'чтобы', choices: ['чтобы', 'потому что', 'если', 'когда'], explanation_uz: 'Maqsad → чтобы + infinitiv.' },
      { id: 'm7-conj-4', type: 'fillBlank', prompt: 'Я хочу, чтобы ты ___ мне. (помочь, o‘tgan zamon)', answer: 'помог', explanation_uz: 'чтобы + помог.' },
      { id: 'm7-conj-5', type: 'choose', prompt: '___ будет время, я приду.', answer: 'Если', choices: ['Если', 'Чтобы', 'Потому что', 'Поэтому'], explanation_uz: 'Shart → если.' },
      { id: 'm7-conj-6', type: 'fillBlank', prompt: 'Если ___ у меня были деньги, я бы купил дом.', answer: 'бы', explanation_uz: 'Noreal shart: если бы + бы.' },
      { id: 'm7-conj-7', type: 'errorHunt', prompt: 'Xatoni toping: «Я хочу, чтобы ты приходишь завтра»', answer: 'Я хочу, чтобы ты пришёл завтра', explanation_uz: "чтобы + o'tgan zamon." },
      { id: 'm7-conj-8', type: 'translate', prompt: 'Tarjima qiling: «Vaqtim bo‘lsa, qo‘ng‘iroq qilaman»', answer: 'Если у меня будет время, я позвоню', explanation_uz: 'Real shart — kelasi zamon.' },
    ],
  },
  {
    id: 'm7-indirect',
    module: 7,
    order: 4,
    level: 'B1',
    title: 'Bilvosita nutq',
    subtitle: 'Он сказал, что...',
    theory: [
      {
        heading: 'Darak gap: что',
        body: "«Я работаю» → Он сказал, что он работает. Rus tilida zamon MOSLASHTIRILMAYDI (inglizchadan farqli): aytilgan zamon saqlanadi.",
      },
      {
        heading: "Savol: ли yoki so'roq so'z",
        body: "So'roq so'zli savol o'z so'zi bilan: «Где ты живёшь?» → Он спросил, где я живу. Ha/yo'q savoli ли bilan: «Ты придёшь?» → Он спросил, приду ли я.",
      },
      {
        heading: 'Iltimos: чтобы',
        body: '«Позвони маме!» → Он попросил, чтобы я позвонил маме. Yoki infinitiv: Он попросил меня позвонить маме.',
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha 'U ishlashini aytdi' kabi qisqartirish ruschada yo'q — to'liq ergash gap ishlatiladi: Он сказал, что (он) работает. Zamon o'zgarmasligi o'zbekchaga o'xshaydi, bu oson.",
    examples: [
      { ru: 'Он сказа́л, что за́втра придёт.', uz: 'U ertaga kelishini aytdi.' },
      { ru: 'Она́ спроси́ла, где я живу́.', uz: 'U qayerda yashashimni so‘radi.' },
      { ru: 'Я не зна́ю, придёт ли он.', uz: 'U keladimi-yo‘qmi, bilmayman.' },
      { ru: 'Ма́ма попроси́ла, что́бы я купи́л хлеб.', uz: 'Onam non olib kelishimni so‘radi.' },
    ],
    commonMistakes: [
      { wrong: 'Он сказал, что он работал (hozir ishlayotganini aytgan bo‘lsa)', right: 'Он сказал, что работает', why_uz: 'Rus tilida zamon moslashuvi YO‘Q.' },
      { wrong: 'Он спросил, что я приду', right: 'Он спросил, приду ли я', why_uz: "Ha/yo'q savoli → ли." },
    ],
    exercises: [
      { id: 'm7-ind-1', type: 'transform', prompt: 'Bilvosita qiling: Он сказал: «Я работаю в банке»', answer: 'Он сказал, что работает в банке', explanation_uz: 'что bilan, zamon saqlanadi.' },
      { id: 'm7-ind-2', type: 'transform', prompt: 'Bilvosita qiling: Она спросила: «Где ты живёшь?»', answer: 'Она спросила, где я живу', explanation_uz: "So'roq so'z saqlanadi." },
      { id: 'm7-ind-3', type: 'choose', prompt: 'Я не знаю, ___ он придёт.', answer: 'придёт ли', choices: ['придёт ли', 'что', 'чтобы', 'если'], explanation_uz: "Ha/yo'q savol → ли (fe'ldan keyin)." },
      { id: 'm7-ind-4', type: 'errorHunt', prompt: 'Xatoni toping: «Он сказал, что он работал в банке» (hozir ham ishlaydi)', answer: 'Он сказал, что работает в банке', explanation_uz: 'Zamon moslashuvi qilinmaydi.' },
      { id: 'm7-ind-5', type: 'translate', prompt: 'Tarjima qiling: «U kelishini aytdi»', answer: 'Он сказал, что придёт', explanation_uz: 'что придёт.' },
    ],
  },
  {
    id: 'm7-numbers',
    module: 7,
    order: 5,
    level: 'B1',
    title: 'Sonlar, vaqt va sana',
    subtitle: 'в два часа, пятого мая',
    theory: [
      {
        heading: 'Soat nechada?',
        body: "в + son + час/часа/часов: в час (soat birda), в два часа, в пять часов. Yarim soatlar: в половине третьего (ikki yarimda — diqqat: keyingi soat aytiladi!).",
        table: [
          ['Savol', 'Javob', "Ma'no"],
          ['Кото́рый час?', 'Два часа́', 'Soat ikki'],
          ['Во ско́лько?', 'В два часа́', 'Soat ikkida'],
          ['', 'В полови́не пя́того', "To'rt yarimda"],
        ],
      },
      {
        heading: 'Sana',
        body: "Bugun nechanchi? — tartib son И.п: Сегодня пятое мая. Qachon? — tartib son Р.п: пятого мая (beshinchi mayda). Yil: в 2026 году (в две тысячи двадцать шестом году).",
      },
      {
        heading: 'Hafta kunlari',
        body: "в + В.п: в понедельник (dushanba kuni), во вторник, в среду, в четверг, в пятницу, в субботу, в воскресенье.",
      },
    ],
    comparisonWithUzbek:
      "'Soat ikkiDA' = в два часа (в + son). 'Beshinchi mayDA' = пятого мая (Р.п, predlogsiz!). 'DushanbaDA' = в понедельник. Uchta turli qolip — yodlab oling.",
    examples: [
      { ru: 'Уро́к начина́ется в де́вять часо́в.', uz: 'Dars soat to‘qqizda boshlanadi.' },
      { ru: 'Сего́дня деся́тое ию́ня.', uz: 'Bugun o‘ninchi iyun.' },
      { ru: 'Я роди́лся пя́того ма́рта.', uz: 'Men beshinchi martda tug‘ilganman.' },
      { ru: 'Мы встре́тимся в суббо́ту.', uz: 'Shanba kuni uchrashamiz.' },
      { ru: 'Сейча́с полови́на восьмо́го.', uz: 'Hozir yetti yarim.' },
    ],
    commonMistakes: [
      { wrong: 'в пятое мая (qachon?)', right: 'пятого мая', why_uz: 'Sana «qachon» — predlogsiz Р.п.' },
      { wrong: 'в субботе', right: 'в субботу', why_uz: 'Hafta kuni — в + В.п.' },
      { wrong: 'пять часа', right: 'пять часов', why_uz: '5+ → Р.п ko‘plik: часов.' },
    ],
    exercises: [
      { id: 'm7-num-1', type: 'fillBlank', prompt: 'Урок начинается ___ девять часов.', answer: 'в', explanation_uz: 'в + soat.' },
      { id: 'm7-num-2', type: 'choose', prompt: '«ikki soat» qanday?', answer: 'два часа', choices: ['два часа', 'два часов', 'два час', 'две часа'], explanation_uz: '2-4 → Р.п birlik: часа.' },
      { id: 'm7-num-3', type: 'choose', prompt: '«besh soat» qanday?', answer: 'пять часов', choices: ['пять часов', 'пять часа', 'пять час', 'пятого часа'], explanation_uz: '5+ → часов.' },
      { id: 'm7-num-4', type: 'choose', prompt: '«Beshinchi mayda» (qachon?)', answer: 'пятого мая', choices: ['пятого мая', 'пятое мая', 'в пятое мая', 'пятый май'], explanation_uz: 'Qachon → Р.п.' },
      { id: 'm7-num-5', type: 'fillBlank', prompt: 'Мы встретимся ___ субботу.', answer: 'в', explanation_uz: 'в субботу.' },
      { id: 'm7-num-6', type: 'translate', prompt: 'Tarjima qiling: «Dars soat uchda tugaydi» (заканчиваться)', answer: 'Урок заканчивается в три часа', explanation_uz: 'в три часа.' },
      { id: 'm7-num-7', type: 'errorHunt', prompt: 'Xatoni toping: «Я родился в десятое июня»', answer: 'Я родился десятого июня', explanation_uz: 'Sana qachon → predlogsiz Р.п.' },
    ],
  },
  {
    id: 'm7-modals',
    module: 7,
    order: 6,
    level: 'B1',
    title: 'Modal so‘zlar: можно, нельзя, надо',
    subtitle: 'Ruxsat, taqiq, zarurat',
    theory: [
      {
        heading: 'Shaxssiz qoliplar',
        body: "Bu so'zlar Д.п bilan keladi (kimga — ixtiyoriy): Мне надо идти. Здесь можно курить? Детям нельзя смотреть этот фильм.",
        table: [
          ["So'z", "Ma'no", 'Misol'],
          ['мо́жно', 'mumkin', 'Мо́жно войти́?'],
          ['нельзя́', 'mumkin emas', 'Здесь нельзя́ кури́ть'],
          ['на́до / ну́жно', 'kerak', 'Мне на́до рабо́тать'],
          ['не на́до', 'kerak emas', 'Не на́до волнова́ться'],
        ],
      },
      {
        heading: "O'tgan/kelasi zamonda",
        body: "было/будет qo'shiladi: Мне надо было позвонить (qo'ng'iroq qilishim kerak edi). Вам нужно будет прийти (kelishingiz kerak bo'ladi).",
      },
      {
        heading: 'нельзя + aspekt',
        body: "нельзя + НСВ = taqiq (mumkin emas, man etilgan): Здесь нельзя парковаться. нельзя + СВ = imkonsiz (iloji yo'q): Эту дверь нельзя открыть (bu eshikni ochib bo'lmaydi).",
      },
    ],
    comparisonWithUzbek:
      "'mumkin' = можно, 'mumkin emas' = нельзя, 'kerak' = надо/нужно. O'zbekchadagidek shaxssiz ishlatiladi. 'ochib bo'lmaydi' (iloji yo'q) uchun нельзя + СВ ishlatilishi nozik farq.",
    examples: [
      { ru: 'Мо́жно вопро́с?', uz: 'Savol bersam mumkinmi?' },
      { ru: 'Здесь нельзя́ фотографи́ровать.', uz: 'Bu yerda suratga olish mumkin emas.' },
      { ru: 'Мне на́до купи́ть проду́кты.', uz: 'Oziq-ovqat olishim kerak.' },
      { ru: 'Тебе́ ну́жно отдохну́ть.', uz: 'Senga dam olish kerak.' },
      { ru: 'На́до бы́ло сказа́ть ра́ньше!', uz: 'Oldinroq aytish kerak edi!' },
    ],
    commonMistakes: [
      { wrong: 'Я надо идти', right: 'Мне надо идти', why_uz: 'надо bilan shaxs Д.п da: мне.' },
      { wrong: 'Можно я войти?', right: 'Можно (мне) войти?', why_uz: 'можно + infinitiv (+ Д.п).' },
      { wrong: 'не можно', right: 'нельзя', why_uz: "'mumkin emas' uchun alohida so'z: нельзя." },
    ],
    exercises: [
      { id: 'm7-mod-1', type: 'choose', prompt: '«mumkin emas» qanday?', answer: 'нельзя', choices: ['нельзя', 'не можно', 'не надо', 'нет можно'], explanation_uz: 'нельзя.' },
      { id: 'm7-mod-2', type: 'fillBlank', prompt: '___ надо больше спать. (men)', answer: 'Мне', explanation_uz: 'Д.п: мне надо.' },
      { id: 'm7-mod-3', type: 'choose', prompt: '«Kirish mumkinmi?»', answer: 'Можно войти?', choices: ['Можно войти?', 'Нельзя войти?', 'Надо войти?', 'Мочь войти?'], explanation_uz: 'Можно + infinitiv.' },
      { id: 'm7-mod-4', type: 'fillBlank', prompt: 'Мне надо ___ позвонить вчера. (edi)', answer: 'было', explanation_uz: 'надо было.' },
      { id: 'm7-mod-5', type: 'errorHunt', prompt: 'Xatoni toping: «Я надо работать»', answer: 'Мне надо работать', explanation_uz: 'Мне (Д.п) надо.' },
      { id: 'm7-mod-6', type: 'translate', prompt: 'Tarjima qiling: «Bu yerda chekish mumkin emas»', answer: 'Здесь нельзя курить', explanation_uz: 'Taqiq → нельзя + НСВ.' },
      { id: 'm7-mod-7', type: 'choose', prompt: '«Bu eshikni ochib bo‘lmaydi» (iloji yo‘q)', answer: 'Эту дверь нельзя открыть', choices: ['Эту дверь нельзя открыть', 'Эту дверь нельзя открывать', 'Эта дверь не можно открыть', 'Эту дверь не надо открыть'], explanation_uz: "Imkonsizlik → нельзя + СВ." },
    ],
  },
];
