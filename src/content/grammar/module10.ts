import type { GrammarTopic } from '../../types';

/** Modul 10 — C1: kitobiy sintaksis, frazeologiya, uslublar, so'z yasalishi, modal yuklamalar */
export const MODULE_10: GrammarTopic[] = [
  {
    id: 'm10-complex-syntax',
    module: 10,
    order: 1,
    level: 'C1',
    title: 'Murakkab kitobiy sintaksis',
    subtitle: 'причём, вследствие чего, поскольку',
    theory: [
      {
        heading: 'Kitobiy bog‘lovchilar',
        body: "C1 matnlarda oddiy потому что o'rniga boyroq vositalar ishlatiladi:",
        table: [
          ["Bog'lovchi", "Ma'no", 'Misol'],
          ['поско́льку', 'modomiki', 'Поско́льку вре́мени ма́ло, начнём.'],
          ['причём', 'shu bilan birga', 'Он рабо́тает, причём о́чень мно́го.'],
          ['всле́дствие чего́', 'oqibatida', 'Шёл дождь, всле́дствие чего́ матч отмени́ли.'],
          ['в то вре́мя как', 'holbuki', 'Он молча́л, в то вре́мя как все говори́ли.'],
          ['и́бо', 'zero (eskirgan)', 'Бу́дь терпели́в, и́бо успе́х тре́бует вре́мени.'],
          ['благодаря́ тому́ что', 'tufayli', 'Благодаря́ тому́ что он помо́г...'],
        ],
      },
      {
        heading: "Murakkab to'ldiruvchili gaplar",
        body: "то bilan kengaytirilgan qoliplar: дело в том, что... (gap shundaki...), речь идёт о том, что... (gap ... haqida ketyapti), я уверен в том, что... — predlog kelishik talab qilganda что oldidan то keladi.",
      },
    ],
    comparisonWithUzbek:
      "'gap shundaki' = дело в том, что; 'shu bilan birga' = причём; 'modomiki' = поскольку. O'zbek kitobiy uslubidagi 'zero', 'binobarin' kabi so'zlarning ruscha muqobillari shular.",
    examples: [
      { ru: 'Де́ло в том, что я уже́ купи́л биле́ты.', uz: 'Gap shundaki, men allaqachon chipta olganman.' },
      { ru: 'Он отли́чный специали́ст, причём о́чень скро́мный.', uz: "U zo'r mutaxassis, shu bilan birga juda kamtar." },
      { ru: 'Поско́льку все согла́сны, начнём.', uz: 'Modomiki hamma rozi ekan, boshlaylik.' },
      { ru: 'Речь идёт о том, что́бы измени́ть пра́вила.', uz: "Gap qoidalarni o'zgartirish haqida ketyapti." },
    ],
    commonMistakes: [
      { wrong: 'Я уверен, в что он придёт', right: 'Я уверен в том, что он придёт', why_uz: 'Predlogdan keyin что emas, то + что: в том, что.' },
      { wrong: 'Дело что я занят', right: 'Дело в том, что я занят', why_uz: "To'liq qolip: дело в том, что." },
    ],
    exercises: [
      { id: 'm10-cs-1', type: 'fillBlank', prompt: 'Дело в ___, что я уже знал ответ.', answer: 'том', explanation_uz: 'дело в том, что.' },
      { id: 'm10-cs-2', type: 'choose', prompt: '«modomiki / -ganligi uchun» (kitobiy)?', answer: 'поскольку', choices: ['поскольку', 'причём', 'ибо', 'зато'], explanation_uz: 'поскольку — kitobiy sabab.' },
      { id: 'm10-cs-3', type: 'choose', prompt: '«shu bilan birga» qaysi so‘z?', answer: 'причём', choices: ['причём', 'отчего', 'поэтому', 'ибо'], explanation_uz: "причём — qo'shimcha kuchaytiruvchi fakt." },
      { id: 'm10-cs-4', type: 'fillBlank', prompt: 'Я уверен в ___, что всё получится.', answer: 'том', explanation_uz: 'уверен в том, что.' },
      { id: 'm10-cs-5', type: 'errorHunt', prompt: 'Xatoni toping: «Речь идёт о что нужно делать»', answer: 'Речь идёт о том, что нужно делать', explanation_uz: 'о + том, что.' },
      { id: 'm10-cs-6', type: 'translate', prompt: 'Tarjima qiling: «Gap shundaki, vaqtimiz kam»', answer: 'Дело в том, что у нас мало времени', explanation_uz: 'дело в том, что + sabab.' },
    ],
  },
  {
    id: 'm10-phraseology',
    module: 10,
    order: 2,
    level: 'C1',
    title: 'Frazeologizmlar va idiomalar',
    subtitle: 'бить баклуши, как рыба в воде',
    theory: [
      {
        heading: 'Eng kerakli idiomalar',
        body: "Idiomalarni so'zma-so'z tarjima qilib bo'lmaydi — yaxlit yodlanadi:",
        table: [
          ['Idioma', "Ma'no", "So'zma-so'z"],
          ['бить баклу́ши', 'bekorchilik qilmoq', "cho'p urmoq"],
          ['как ры́ба в воде́', "o'z muhitida", 'suvdagi baliqdek'],
          ['взять себя́ в ру́ки', "o'zini qo'lga olmoq", "o'zini qo'lga olmoq"],
          ['води́ть за́ нос', 'laqillatmoq', 'burnidan yetaklamoq'],
          ['не в свое́й таре́лке', "o'zini noqulay sezmoq", "o'z likopchasida emas"],
          ['заруби́ть на носу́', 'quloqqa quyib olmoq', 'burunga o‘yib yozmoq'],
          ['де́лать из му́хи слона́', "pashshadan fil yasamoq", 'xuddi shu!'],
          ['ни пу́ха ни пера́', 'omad tilayman', 'na par, na pat'],
        ],
      },
      {
        heading: 'Javob odobi',
        body: "Ни пуха ни пера! ga javob — К чёрту! (an'anaviy, qo'pollik emas). Спасибо deb javob berish — irim bo'yicha omadni qochirish.",
      },
    ],
    comparisonWithUzbek:
      "Ba'zilari o'zbekcha bilan aynan mos: делать из мухи слона = pashshadan fil yasamoq, взять себя в руки = o'zini qo'lga olmoq. Bunday mosliklarni topish idiomani bir umrga yodda qoldiradi.",
    examples: [
      { ru: 'Хва́тит бить баклу́ши — рабо́тать пора́!', uz: 'Bekorchilikni bas qil — ishlash vaqti!' },
      { ru: 'На сце́не она́ как ры́ба в воде́.', uz: 'Sahnada u suvdagi baliqdek erkin.' },
      { ru: 'Возьми́ себя́ в ру́ки и продолжа́й.', uz: "O'zingni qo'lga ol va davom et." },
      { ru: 'Он во́дит тебя́ за́ нос!', uz: 'U seni laqillatyapti!' },
      { ru: 'Не де́лай из му́хи слона́.', uz: 'Pashshadan fil yasama.' },
    ],
    commonMistakes: [
      { wrong: "Idiomani so'zma-so'z tarjima qilish", right: 'Yaxlit ekvivalent topish', why_uz: "'бить баклуши' ni 'cho'p urmoq' deb tarjima qilsangiz hech kim tushunmaydi." },
      { wrong: 'Ни пуха ни пера! → Спасибо!', right: 'К чёрту!', why_uz: "An'anaviy javob — К чёрту." },
    ],
    exercises: [
      { id: 'm10-phr-1', type: 'choose', prompt: '«бить баклуши» nimani anglatadi?', answer: 'bekorchilik qilmoq', choices: ['bekorchilik qilmoq', 'urishmoq', "cho'p yig'moq", 'shoshilmoq'], explanation_uz: 'Bekor yurmoq.' },
      { id: 'm10-phr-2', type: 'choose', prompt: '«pashshadan fil yasamoq» ruscha?', answer: 'делать из мухи слона', choices: ['делать из мухи слона', 'водить за нос', 'бить баклуши', 'брать быка за рога'], explanation_uz: 'Aynan mos idioma.' },
      { id: 'm10-phr-3', type: 'choose', prompt: '«Ни пуха ни пера!» ga javob?', answer: 'К чёрту!', choices: ['К чёрту!', 'Спасибо!', 'Пожалуйста!', 'Не за что!'], explanation_uz: "An'anaviy irim-javob." },
      { id: 'm10-phr-4', type: 'choose', prompt: '«u seni laqillatyapti» qanday?', answer: 'он водит тебя за нос', choices: ['он водит тебя за нос', 'он бьёт тебя баклуши', 'он берёт тебя в руки', 'он делает тебя слоном'], explanation_uz: 'водить за нос — aldab yurmoq.' },
      { id: 'm10-phr-5', type: 'fillBlank', prompt: 'Возьми себя в ___ и успокойся.', answer: 'руки', explanation_uz: 'взять себя в руки.' },
      { id: 'm10-phr-6', type: 'choose', prompt: '«o‘zini noqulay sezmoq»?', answer: 'не в своей тарелке', choices: ['не в своей тарелке', 'как рыба в воде', 'ни пуха ни пера', 'на носу'], explanation_uz: 'чувствовать себя не в своей тарелке.' },
    ],
  },
  {
    id: 'm10-formal-style',
    module: 10,
    order: 3,
    level: 'C1',
    title: 'Rasmiy va ilmiy uslub',
    subtitle: 'Hujjat, ariza, rasmiy xat tili',
    theory: [
      {
        heading: 'Rasmiy uslub belgilari',
        body: "1) Passiv: Заявление рассматривается (ariza ko'rib chiqilmoqda). 2) Otlashgan fe'llar: рассмотрение, предоставление, осуществление. 3) Qoliplar: в связи с (munosabati bilan), в соответствии с (muvofiq), по причине (sababli).",
        table: [
          ["Og'zaki", 'Rasmiy', "Ma'no"],
          ['помо́чь', 'оказа́ть по́мощь', "yordam ko'rsatmoq"],
          ['реши́ть', 'приня́ть реше́ние', 'qaror qabul qilmoq'],
          ['уча́ствовать', 'принима́ть уча́стие', 'ishtirok etmoq'],
          ['спроси́ть', 'обрати́ться с вопро́сом', "savol bilan murojaat qilmoq"],
        ],
      },
      {
        heading: 'Rasmiy xat qoliplari',
        body: "Уважаемый Иван Иванович! (Hurmatli...). Прошу Вас рассмотреть... (... ko'rib chiqishingizni so'rayman). Заранее благодарю (oldindan minnatdorman). С уважением, ... (hurmat bilan). Rasmiy Вы doim bosh harf bilan.",
      },
    ],
    comparisonWithUzbek:
      "O'zbek rasmiy uslubidagi 'amalga oshirmoq', 'taqdim etmoq' kabi konstruksiyalarga mos: осуществлять, предоставлять. Ariza yozish qolipi ham o'xshash: 'so'rayman' = Прошу Вас.",
    examples: [
      { ru: 'Прошу́ Вас предоста́вить мне о́тпуск.', uz: "Menga ta'til berishingizni so'rayman." },
      { ru: 'В свя́зи с боле́знью я не смогу́ прийти́.', uz: 'Kasallik munosabati bilan kela olmayman.' },
      { ru: 'Ва́ше заявле́ние бу́дет рассмо́трено в тече́ние трёх дней.', uz: "Arizangiz uch kun ichida ko'rib chiqiladi." },
      { ru: 'С уваже́нием, Алише́р Усма́нов.', uz: 'Hurmat bilan, Alisher Usmanov.' },
    ],
    commonMistakes: [
      { wrong: 'Привет, директор! (rasmiy xatda)', right: 'Уважаемый + ism-sharif!', why_uz: 'Rasmiy murojaat qolipi qat’iy.' },
      { wrong: 'я хочу отпуск (arizada)', right: 'Прошу предоставить мне отпуск', why_uz: 'Ariza tili — прошу + infinitiv.' },
    ],
    exercises: [
      { id: 'm10-fs-1', type: 'choose', prompt: 'Rasmiy xat qanday boshlanadi?', answer: 'Уважаемый Иван Иванович!', choices: ['Уважаемый Иван Иванович!', 'Привет, Иван!', 'Эй, директор!', 'Здорово, Иваныч!'], explanation_uz: 'Уважаемый + ism-sharif.' },
      { id: 'm10-fs-2', type: 'choose', prompt: '«ishtirok etmoq» rasmiy varianti?', answer: 'принимать участие', choices: ['принимать участие', 'участвоваться', 'быть внутри', 'делать участие'], explanation_uz: 'принимать участие в + П.п.' },
      { id: 'm10-fs-3', type: 'fillBlank', prompt: 'В связи ___ болезнью я отсутствовал.', answer: 'с', explanation_uz: 'в связи с + Т.п.' },
      { id: 'm10-fs-4', type: 'translate', prompt: 'Tarjima qiling: «Ta’til berishingizni so‘rayman» (отпуск)', answer: 'Прошу Вас предоставить мне отпуск', explanation_uz: 'Ariza qolipi.' },
      { id: 'm10-fs-5', type: 'choose', prompt: 'Xat oxirida nima yoziladi?', answer: 'С уважением', choices: ['С уважением', 'Пока', 'Целую', 'Удачи'], explanation_uz: 'С уважением — rasmiy yakun.' },
      { id: 'm10-fs-6', type: 'errorHunt', prompt: 'Xatoni toping (rasmiy): «Я хочу что вы дали мне отпуск»', answer: 'Прошу Вас предоставить мне отпуск', explanation_uz: 'Rasmiy ariza qolipida yoziladi.' },
    ],
  },
  {
    id: 'm10-colloquial',
    module: 10,
    order: 4,
    level: 'C1',
    title: "So'zlashuv uslubi",
    subtitle: 'Ну, давай, короче, ладно',
    theory: [
      {
        heading: "Jonli nutq so'zlari",
        body: "Real suhbatni tushunish uchun shart:",
        table: [
          ["So'z", "Ma'no", 'Misol'],
          ['ну', "xo'sh / eh", 'Ну, что де́лать бу́дем?'],
          ['дава́й', 'kel / xayr', 'Дава́й встре́тимся! / Ну всё, дава́й!'],
          ['коро́че', "qisqasi", 'Коро́че, я не приду́.'],
          ['ла́дно', 'mayli', 'Ла́дно, договори́лись.'],
          ['ка́жется', 'shekilli', 'Он, ка́жется, ушёл.'],
          ['вро́де', 'aftidan', 'Вро́де всё гото́во.'],
          ['чуть не', 'sal qoldi', 'Я чуть не упа́л.'],
          ['да ну!', "yo'g'-e!", 'Да ну! Не мо́жет быть!'],
        ],
      },
      {
        heading: 'Ellipsis — tushirib qoldirish',
        body: "Og'zaki nutqda gap qisqaradi: Ты куда? (idёшь tushirilgan — qayoqqa ketyapsan?). Мне два кофе (дайте tushirilgan). Вы выходите? (avtobusda). Bu xato emas — jonli norma.",
      },
    ],
    comparisonWithUzbek:
      "'qisqasi' = короче, 'mayli' = ладно, 'shekilli' = кажется, 'sal qoldi' = чуть не, 'yo'g'-e' = да ну. 'Давай' xayrlashuvda ham ishlatiladi — o'zbekcha 'bo'pti, ko'rishamiz' kabi.",
    examples: [
      { ru: 'Ну что, пошли́?', uz: "Xo'sh, ketdikmi?" },
      { ru: 'Коро́че, де́ло бы́ло так...', uz: "Qisqasi, ish bunday bo'lgan edi..." },
      { ru: 'Я чуть не опозда́л на по́езд!', uz: 'Poyezdga sal qolsa kechikardim!' },
      { ru: 'Ла́дно, дава́й, до за́втра!', uz: "Mayli, bo'pti, ertagacha!" },
      { ru: 'Ты куда́? — Домо́й.', uz: 'Qayoqqa? — Uyga.' },
    ],
    commonMistakes: [
      { wrong: "Rasmiy xatda 'короче' ishlatish", right: "Faqat og'zaki nutqda", why_uz: "So'zlashuv so'zlari yozma rasmiy matnga kirmaydi." },
      { wrong: 'давай ni faqat «kel» deb tushunish', right: "xayrlashuvda ham: Ну всё, давай!", why_uz: 'Kontekstga qarang.' },
    ],
    exercises: [
      { id: 'm10-col-1', type: 'choose', prompt: '«qisqasi» qanday?', answer: 'короче', choices: ['короче', 'длиннее', 'ладно', 'вроде'], explanation_uz: 'короче — qisqasi.' },
      { id: 'm10-col-2', type: 'choose', prompt: '«Я чуть не упал» nimani anglatadi?', answer: 'sal qolsa yiqilardim', choices: ['sal qolsa yiqilardim', 'ozgina yiqildim', 'umuman yiqilmadim', 'sekin yiqildim'], explanation_uz: 'чуть не — sal qoldi (sodir bo‘lmadi).' },
      { id: 'm10-col-3', type: 'choose', prompt: 'Suhbat oxirida «Ну всё, давай!» nimani bildiradi?', answer: 'xayrlashuv', choices: ['xayrlashuv', 'biror narsa berishni so‘rash', 'jahl', 'taklif boshlanishi'], explanation_uz: "давай — og'zaki xayrlashuv." },
      { id: 'm10-col-4', type: 'choose', prompt: '«mayli» qanday?', answer: 'ладно', choices: ['ладно', 'плохо', 'строго', 'трудно'], explanation_uz: 'ладно — rozi bo‘lish.' },
      { id: 'm10-col-5', type: 'fillBlank', prompt: 'Он, ка___, уже ушёл. (shekilli)', answer: 'жется', explanation_uz: 'кажется — shekilli.' },
      { id: 'm10-col-6', type: 'translate', prompt: 'Tarjima qiling (og‘zaki): «Qayoqqa?» (ketayotgan odamga)', answer: 'Ты куда?', explanation_uz: 'Ellipsis: идёшь tushiriladi.' },
    ],
  },
  {
    id: 'm10-modal-particles',
    module: 10,
    order: 5,
    level: 'C1',
    title: 'Modal yuklamalar chuqur',
    subtitle: 'разве, неужели, уж, ведь, же',
    theory: [
      {
        heading: 'Hayrat va shubha',
        body: "разве — shubhali savol (nahotki, menimcha unday emas): Разве он врач? неужели — kuchli hayrat (nahotki?!): Неужели ты выиграл?!",
      },
      {
        heading: "Ta'kid yuklamalari",
        body: "же — axir/o'sha: Я же говорил! (men aytgandim-ku!). ведь — axir (sababga ishora): Оденься, ведь холодно. уж — kuchaytirish: Уж он-то знает (u-ku aniq biladi). -ка — buyruqni yumshatish: Скажи-ка... (ayt-chi...).",
        table: [
          ['Yuklama', "Ma'no", 'Misol'],
          ['ра́зве', 'nahotki (shubha)', 'Ра́зве э́то пра́вда?'],
          ['неуже́ли', 'nahotki?! (hayrat)', 'Неуже́ли ты не знал?!'],
          ['же', '-ku / axir', 'Ты же обеща́л!'],
          ['ведь', 'axir (sabab)', 'Не спеши́, ведь вре́мя есть.'],
          ['-ка', '-chi (yumshatish)', 'Посмотри́-ка сюда́!'],
        ],
      },
    ],
    comparisonWithUzbek:
      "O'zbek tilida aynan mos yuklamalar bor: '-ku' = же, 'axir' = ведь, 'nahotki' = неужели/разве, '-chi' = -ка. Ayt-chi = скажи-ка, bilarding-ku = ты же знал. Bu mosliklar tufayli C1 yuklamalari o'zbeklar uchun oson!",
    examples: [
      { ru: 'Ра́зве ты не слы́шал но́вость?', uz: 'Nahotki yangilikni eshitmagan bo‘lsang?' },
      { ru: 'Неуже́ли э́то всё бесп́латно?!', uz: 'Nahotki bularning hammasi bepul?!' },
      { ru: 'Я же тебе́ говори́л!', uz: 'Men senga aytgandim-ku!' },
      { ru: 'Не волну́йся, ведь всё хорошо́.', uz: 'Xavotir olma, axir hammasi yaxshi.' },
      { ru: 'Расскажи́-ка, что случи́лось.', uz: 'Aytib ber-chi, nima bo‘ldi.' },
    ],
    commonMistakes: [
      { wrong: 'же ni gap boshiga qo‘yish', right: "ta'kidlangan so'zdan keyin", why_uz: 'же doim urg‘u tushgan so‘zdan keyin: Я же / Ты же.' },
      { wrong: 'разве va неужели ni farqlamaslik', right: 'разве — yengil shubha, неужели — kuchli hayrat', why_uz: 'Intonatsiya darajasi har xil.' },
    ],
    exercises: [
      { id: 'm10-mp-1', type: 'fillBlank', prompt: 'Я ___ тебе говорил! (-ku)', answer: 'же', explanation_uz: 'же — ta’kid.' },
      { id: 'm10-mp-2', type: 'choose', prompt: '«Nahotki yutgan bo‘lsang?!» (kuchli hayrat)', answer: 'Неужели ты выиграл?!', choices: ['Неужели ты выиграл?!', 'Разве ты выиграл?', 'Ведь ты выиграл!', 'Ты же выиграл.'], explanation_uz: 'Kuchli hayrat → неужели.' },
      { id: 'm10-mp-3', type: 'fillBlank', prompt: 'Оденься теплее, ___ на улице мороз. (axir)', answer: 'ведь', explanation_uz: 'ведь — sababga ishora.' },
      { id: 'm10-mp-4', type: 'choose', prompt: '«ayt-chi» qanday?', answer: 'скажи-ка', choices: ['скажи-ка', 'скажи же', 'разве скажи', 'скажи ведь'], explanation_uz: '-ка buyruqni yumshatadi.' },
      { id: 'm10-mp-5', type: 'choose', prompt: 'же qayerda turadi?', answer: "ta'kidlangan so'zdan keyin", choices: ["ta'kidlangan so'zdan keyin", 'doim gap boshida', 'doim gap oxirida', "fe'ldan oldin"], explanation_uz: 'Я же, ты же, он же...' },
      { id: 'm10-mp-6', type: 'translate', prompt: 'Tarjima qiling: «Sen va’da bergan eding-ku!» (обещать)', answer: 'Ты же обещал!', explanation_uz: 'же = -ku.' },
    ],
  },
  {
    id: 'm10-word-formation',
    module: 10,
    order: 6,
    level: 'C1',
    title: "So'z yasalishi",
    subtitle: '-ость, -ние, -тель, без-, не-',
    theory: [
      {
        heading: 'Suffikslar tizimi',
        body: "Suffiksni bilish notanish so'zni 'ochadi':",
        table: [
          ['Suffiks', 'Yasaydi', 'Misol'],
          ['-ость', 'mavhum ot (-lik)', 'но́вый → но́вость, ста́рый → ста́рость'],
          ['-ние/-тие', "ish-harakat oti", 'чита́ть → чте́ние, разви́ть → разви́тие'],
          ['-тель', 'bajaruvchi (-chi)', 'учи́ть → учи́тель, писа́ть → писа́тель'],
          ['-ик/-ник', 'shaxs/predmet', 'исто́рия → исто́рик, чай → ча́йник'],
          ['-ка', 'ayol shaxs / kichraytirish', 'студе́нт → студе́нтка'],
          ['-оват-', 'biroz (-roq)', 'сла́дкий → сладкова́тый'],
        ],
      },
      {
        heading: 'Prefiks + sifat',
        body: "без-/бес- = -siz: безрабо́тный (ishsiz), бесполе́зный (foydasiz). не- = inkor: неинтере́сный. пре- = juda: премудрый. анти-, сверх-, меж- — xalqaro prefikslar.",
      },
    ],
    comparisonWithUzbek:
      "-ость = '-lik' (yangiLIK = новость), -тель = '-chi' (yozuvCHI = писатель), без- = '-siz' (ishSIZ = безработный), -оват = '-roq' (shirinROQ = сладковатый). Bu paralellarni bilish lug'atsiz o'qish imkonini beradi.",
    examples: [
      { ru: 'ста́рость — не ра́дость', uz: "qarilik — quvonch emas (maqol)" },
      { ru: 'безрабо́тица растёт', uz: 'ishsizlik oshyapti' },
      { ru: 'чте́ние развива́ет мышле́ние', uz: "o'qish tafakkurni rivojlantiradi" },
      { ru: 'э́тот суп солонова́тый', uz: "bu sho'rva sho'rroq" },
      { ru: 'преподава́тель университе́та', uz: "universitet o'qituvchisi" },
    ],
    commonMistakes: [
      { wrong: 'новость ni faqat «yangilik xabari» deb bilish', right: "-ость = mavhum '-lik'", why_uz: "Suffiks ma'nosini bilsangiz molodость, смелость... hammasi ochiladi." },
      { wrong: 'бесполезный → "juda foydali"', right: 'foydaSIZ', why_uz: 'без-/бес- inkor, kuchaytirish emas.' },
    ],
    exercises: [
      { id: 'm10-wf-1', type: 'transform', prompt: "Ot yasang: молодой → (yoshlik)", answer: 'молодость', explanation_uz: '-ость.' },
      { id: 'm10-wf-2', type: 'transform', prompt: "Bajaruvchi yasang: строить → (quruvchi)", answer: 'строитель', explanation_uz: '-тель.' },
      { id: 'm10-wf-3', type: 'choose', prompt: '«ishsiz» qanday?', answer: 'безработный', choices: ['безработный', 'неработа', 'распработный', 'околоработный'], explanation_uz: 'без- = -siz.' },
      { id: 'm10-wf-4', type: 'choose', prompt: '«сладковатый» nimani anglatadi?', answer: 'shirinroq / biroz shirin', choices: ['shirinroq / biroz shirin', 'juda shirin', 'shirin emas', 'eng shirin'], explanation_uz: '-оват- = biroz.' },
      { id: 'm10-wf-5', type: 'transform', prompt: 'Ish-harakat oti: читать → ...', answer: 'чтение', explanation_uz: 'чтение — o‘qish (jarayon).' },
      { id: 'm10-wf-6', type: 'choose', prompt: '«чайник» so‘zi qanday yasalgan?', answer: 'чай + -ник (predmet)', choices: ['чай + -ник (predmet)', 'чайн + ик', 'ча + йник', "bu yasama so'z emas"], explanation_uz: '-ник predmet yasaydi: choynak.' },
      { id: 'm10-wf-7', type: 'translate', prompt: 'Suffiks orqali toping: «jasorat/dadillik» (смелый)', answer: 'смелость', explanation_uz: 'смелый + -ость.' },
    ],
  },
  {
    id: 'm10-synonyms-register',
    module: 10,
    order: 7,
    level: 'C1',
    title: 'Sinonimlar va registr',
    subtitle: 'говорить / сказать / болтать / заявить',
    theory: [
      {
        heading: "Bir ma'no — turli bo'yoq",
        body: "C1 daraja — to'g'ri so'zni to'g'ri vaziyatda tanlash:",
        table: [
          ["So'z", 'Registr', "Bo'yoq"],
          ['говори́ть', 'neytral', 'gapirmoq'],
          ['болта́ть', "so'zlashuv", 'valaqlamoq'],
          ['бесе́довать', 'kitobiy', 'suhbatlashmoq'],
          ['заяви́ть', 'rasmiy', "bayon qilmoq"],
          ['про́изнести́', 'kitobiy', 'talaffuz etmoq / nutq aytmoq'],
        ],
      },
      {
        heading: 'Yana misollar',
        body: "smотреть (neytral) / глазеть (qo'pol — bakrayib qaramoq) / созерцать (poetik). есть (neytral) / кушать (bolalarga/mehmonga muloyim) / жрать (dag'al). дом (neytral) / жильё (rasmiy) / хата (sleng).",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha 'gapirmoq/valaqlamoq/suhbatlashmoq/bayon qilmoq' qatori ruscha говорить/болтать/беседовать/заявить ga aynan mos. Registrni adashtirish — ma'noni emas, OBRO'ni buzadi: rasmiy yig'ilishda болтать deyish kulgili.",
    examples: [
      { ru: 'Мы до́лго бесе́довали о жи́зни.', uz: 'Biz hayot haqida uzoq suhbatlashdik. (kitobiy)' },
      { ru: 'Хва́тит болта́ть, рабо́тай!', uz: 'Valaqlashni bas qil, ishla! (so‘zlashuv)' },
      { ru: 'Мини́стр заяви́л о но́вой рефо́рме.', uz: 'Vazir yangi islohot haqida bayonot berdi. (rasmiy)' },
      { ru: 'Куша́йте, пожа́луйста!', uz: 'Marhamat, yeb oling! (mehmonga muloyim)' },
    ],
    commonMistakes: [
      { wrong: 'Министр болтал о реформе', right: 'Министр заявил о реформе', why_uz: 'Rasmiy kontekst — rasmiy fe’l.' },
      { wrong: 'Я кушаю (kattalar o‘zi haqida)', right: 'Я ем', why_uz: "кушать — boshqalarga muloyim taklif; o'zi haqida есть." },
    ],
    exercises: [
      { id: 'm10-syn-1', type: 'choose', prompt: 'Rasmiy bayonot uchun qaysi fe’l?', answer: 'заявить', choices: ['заявить', 'болтать', 'поболтать', 'трепаться'], explanation_uz: 'заявить — rasmiy.' },
      { id: 'm10-syn-2', type: 'choose', prompt: '«valaqlamoq» qanday?', answer: 'болтать', choices: ['болтать', 'беседовать', 'произнести', 'заявить'], explanation_uz: "болтать — so'zlashuv." },
      { id: 'm10-syn-3', type: 'choose', prompt: 'Mehmonga muloyim: «yeb oling»', answer: 'Кушайте, пожалуйста', choices: ['Кушайте, пожалуйста', 'Жрите, пожалуйста', 'Ешь давай', 'Поглощайте'], explanation_uz: 'кушать — mehmondorchilik odobi.' },
      { id: 'm10-syn-4', type: 'choose', prompt: "O'zi haqida to'g'ri shakl:", answer: 'Я ем', choices: ['Я ем', 'Я кушаю', 'Я жру', 'Я вкушаю'], explanation_uz: "O'z nutqida neytral есть." },
      { id: 'm10-syn-5', type: 'errorHunt', prompt: 'Registr xatosini toping: «Президент поболтал с народом о налогах»', answer: 'Президент побеседовал с народом о налогах', explanation_uz: 'Rasmiy shaxs — беседовать/заявить.' },
      { id: 'm10-syn-6', type: 'choose', prompt: 'Neytral «uy» rasmiy hujjatda?', answer: 'жильё', choices: ['жильё', 'хата', 'домик', 'берлога'], explanation_uz: 'жильё — rasmiy termin.' },
    ],
  },
  {
    id: 'm10-gerund-advanced',
    module: 10,
    order: 8,
    level: 'C1',
    title: 'Ravishdosh oborotlari va tinish belgilari',
    subtitle: "Murakkab gapni to'g'ri yozish",
    theory: [
      {
        heading: 'Ravishdosh oboroti doim vergulda',
        body: "Ravishdosh va unga bog'liq so'zlar har doim verguldan ajratiladi: Прочитав письмо, он улыбнулся. Он шёл, не спеша, по улице. Bitta yolg'iz ravishdosh ham: Улыбаясь, она вошла.",
      },
      {
        heading: 'Asosiy xato: ega mosligi',
        body: "Ravishdosh faqat gap egasining ishini bildiradi. «Подъезжая к станции, у меня слетела шляпа» — XATO (shlyapa stansiyaga yaqinlashmagan!). To'g'ri: Подъезжая к станции, я потерял шляпу.",
      },
      {
        heading: 'Turg‘un birikmalar vergulsiz',
        body: "Frazeologik ravishdoshlar ajratilmaydi: работать спустя рукава (chala ishlamoq), бежать сломя голову (boshini olib qochmoq), сидеть сложа руки (qo'l qovushtirib o'tirmoq).",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha '-ib' oboroti ham faqat ega bilan bog'lanadi: 'Xatni o'qib, u jilmaydi' — to'g'ri; 'Xatni o'qib, shlyapam uchdi' — xuddi ruschadagidek mantiqsiz. Ona tilingizdagi shu sezgi ruschada ham ishlaydi.",
    examples: [
      { ru: 'Прочита́в письмо́, он улыбну́лся.', uz: "Xatni o'qib, u jilmaydi." },
      { ru: 'Не зна́я пра́вил, тру́дно игра́ть.', uz: "Qoidalarni bilmay turib o'ynash qiyin." },
      { ru: 'Он сиде́л сложа́ ру́ки.', uz: "U qo'l qovushtirib o'tirardi.", note: 'frazeologizm — vergulsiz' },
      { ru: 'Верну́вшись домо́й, я сра́зу лёг спать.', uz: 'Uyga qaytib, darrov uxlashga yotdim.' },
    ],
    commonMistakes: [
      { wrong: 'Подъезжая к станции, у меня слетела шляпа', right: 'Подъезжая к станции, я потерял шляпу', why_uz: 'Ravishdosh egasi gap egasi bilan bir xil bo‘lishi shart.' },
      { wrong: 'Прочитав письмо он улыбнулся', right: 'Прочитав письмо, он улыбнулся', why_uz: 'Oborot verguldan ajratiladi.' },
      { wrong: 'Он бежал, сломя голову', right: 'Он бежал сломя голову', why_uz: 'Frazeologizm vergulsiz.' },
    ],
    exercises: [
      { id: 'm10-ga-1', type: 'choose', prompt: "Qaysi gap to'g'ri?", answer: 'Прочитав письмо, он улыбнулся', choices: ['Прочитав письмо, он улыбнулся', 'Прочитав письмо, письмо понравилось', 'Прочитав письмо, у него улыбка', 'Прочитав письмо улыбнулся он сразу же'], explanation_uz: 'Ega (он) ravishdosh ishini ham bajargan.' },
      { id: 'm10-ga-2', type: 'errorHunt', prompt: 'Mantiqiy xatoni toping: «Открыв окно, в комнату влетела птица»', answer: 'Когда я открыл окно, в комнату влетела птица', explanation_uz: "Qush oynani ochmagan — ega mos emas, gapni qayta qurish kerak." },
      { id: 'm10-ga-3', type: 'choose', prompt: '«сидеть сложа руки» nimani anglatadi?', answer: "qo'l qovushtirib (bekor) o'tirmoq", choices: ["qo'l qovushtirib (bekor) o'tirmoq", "qo'lni jarohatlamoq", 'tez ishlamoq', "qo'l silkitmoq"], explanation_uz: 'Frazeologizm: hech narsa qilmay o‘tirmoq.' },
      { id: 'm10-ga-4', type: 'choose', prompt: 'Qaysi birikma VERGULSIZ yoziladi?', answer: 'бежал сломя голову', choices: ['бежал сломя голову', 'прочитав письмо', 'вернувшись домой', 'не зная правил'], explanation_uz: 'Frazeologik ravishdosh ajratilmaydi.' },
      { id: 'm10-ga-5', type: 'transform', prompt: 'Ravishdosh bilan birlashtiring: «Я вернулся домой. Я сразу лёг спать»', answer: 'Вернувшись домой, я сразу лёг спать', explanation_uz: 'вернувшись — СВ ravishdoshi.' },
      { id: 'm10-ga-6', type: 'translate', prompt: 'Tarjima qiling: «Qoidani bilmay turib o‘ynama» (знать, играть)', answer: 'Не зная правил, не играй', explanation_uz: 'не зная — inkor ravishdosh.' },
    ],
  },
];
