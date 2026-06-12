import type { GrammarTopic, LearningMethod } from '../types';

export const LEARNING_METHODS: LearningMethod[] = [
  {
    id: 'active-recall',
    title: 'Active Recall',
    goal: "Qoidani o'qib qo'ymasdan, javobni xotiradan chiqarish.",
    steps: ["Savolni ko'ring", "Javobni yozing yoki ayting", "Keyin to'g'ri javob bilan solishtiring"],
    bestFor: "So'z, kelishik, fe'l tuslash",
  },
  {
    id: 'pattern-drill',
    title: 'Pattern Drill',
    goal: 'Bitta grammatik qolipni ko‘p variantda avtomatlashtirish.',
    steps: ['Qolipni ko‘ring', 'So‘zni almashtiring', 'Gapni ovoz chiqarib ayting'],
    bestFor: 'Я хочу..., Мне нужно..., У меня есть...',
  },
  {
    id: 'sentence-transform',
    title: 'Sentence Transformation',
    goal: "Gapni zamon, shaxs yoki kelishik bo'yicha o'zgartirish.",
    steps: ["Berilgan gapni o'qing", "Talab qilingan shaklga o'tkazing", "Xatoni izoh bilan tuzating"],
    bestFor: "Fe'l zamonlari, savol/inkor gap",
  },
  {
    id: 'shadowing',
    title: 'Shadowing',
    goal: "Ruscha gap ritmini va talaffuzini ko'chirish.",
    steps: ['Gapni tinglang', 'Darhol ortidan ayting', '3 marta takrorlang'],
    bestFor: 'Speaking va listening',
  },
  {
    id: 'dictation',
    title: 'Mini Dictation',
    goal: 'Eshitilgan ruscha gapni yozish orqali listening va spellingni kuchaytirish.',
    steps: ['Gapni eshiting', 'Yozing', 'So‘zma-so‘z tekshiring'],
    bestFor: 'Harflar, yumshoq belgi, predloglar',
  },
  {
    id: 'role-play',
    title: 'Role Play',
    goal: 'Grammatikani real vaziyatda ishlatish.',
    steps: ['Vaziyat tanlang', 'Ruscha javob bering', 'AI yoki app xatoni tuzatsin'],
    bestFor: "Do'kon, restoran, taksi, ish, telefon",
  },
];

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'alphabet-pronunciation',
    title: 'Alfavit va talaffuz',
    subtitle: 'Rus harflari, urg‘u va o‘qilish asoslari.',
    level: 'beginner',
    category: 'foundation',
    rule_uz: "Rus tilida urg'u juda muhim: bir xil yozilgan so'z urg'u bilan boshqacha eshitilishi mumkin. Har yangi so'zni ovoz bilan takrorlash kerak.",
    examples: [
      { ru: 'мама', uz: 'ona', note: 'a harfi aniq eshitiladi' },
      { ru: 'молоко', uz: 'sut', note: "urg'usiz o ko'pincha a ga yaqin eshitiladi" },
    ],
    exercises: [
      { id: 'alphabet-1', type: 'choose', prompt: 'мама so‘zi nimani anglatadi?', answer: 'ona', choices: ['ona', 'ota', 'aka', 'sut'], explanation_uz: 'мама - ona.' },
      { id: 'alphabet-2', type: 'fillBlank', prompt: 'молоко = ___', answer: 'sut', explanation_uz: 'молоко - sut.' },
    ],
  },
  {
    id: 'gender',
    title: 'Rod: мужской, женский, средний',
    subtitle: 'Otlarning jinsi va oxirgi harfiga qarab aniqlash.',
    level: 'beginner',
    category: 'nouns',
    rule_uz: "Ko'pincha undosh bilan tugasa мужской, -а/-я bilan tugasa женский, -о/-е bilan tugasa средний bo'ladi.",
    examples: [
      { ru: 'стол - он', uz: 'stol - u', note: 'undosh bilan tugagan' },
      { ru: 'книга - она', uz: 'kitob - u', note: '-а bilan tugagan' },
      { ru: 'окно - оно', uz: 'deraza - u', note: '-о bilan tugagan' },
    ],
    exercises: [
      { id: 'gender-1', type: 'choose', prompt: 'книга qaysi rod?', answer: 'женский', choices: ['мужской', 'женский', 'средний'], explanation_uz: 'книга -а bilan tugaydi, odatda женский.' },
      { id: 'gender-2', type: 'choose', prompt: 'окно qaysi rod?', answer: 'средний', choices: ['мужской', 'женский', 'средний'], explanation_uz: 'окно -о bilan tugaydi, средний.' },
    ],
  },
  {
    id: 'plural',
    title: 'Ko‘plik shakli',
    subtitle: 'Otlarni birlikdan ko‘plikka o‘tkazish.',
    level: 'beginner',
    category: 'nouns',
    rule_uz: "Ko'p otlar -ы/-и bilan ko'plikka o'tadi: стол -> столы, книга -> книги. -о/-е ko'pincha -а/-я bo'ladi: окно -> окна.",
    examples: [
      { ru: 'стол -> столы', uz: 'stol -> stollar' },
      { ru: 'книга -> книги', uz: 'kitob -> kitoblar' },
      { ru: 'окно -> окна', uz: 'deraza -> derazalar' },
    ],
    exercises: [
      { id: 'plural-1', type: 'transform', prompt: 'стол so‘zini ko‘plikka o‘tkazing', answer: 'столы', explanation_uz: 'стол -> столы.' },
      { id: 'plural-2', type: 'transform', prompt: 'книга so‘zini ko‘plikka o‘tkazing', answer: 'книги', explanation_uz: 'книга -> книги.' },
    ],
  },
  {
    id: 'pronouns',
    title: 'Olmoshlar',
    subtitle: 'Я, ты, он, она, мы, вы, они.',
    level: 'beginner',
    category: 'foundation',
    rule_uz: "Rus tilida fe'l ko'pincha shaxsga qarab o'zgaradi, shuning uchun olmoshlarni mustahkam bilish kerak.",
    examples: [
      { ru: 'Я студент.', uz: 'Men studentman.' },
      { ru: 'Мы дома.', uz: 'Biz uydamiz.' },
    ],
    exercises: [
      { id: 'pronouns-1', type: 'choose', prompt: 'Мы nimani bildiradi?', answer: 'biz', choices: ['men', 'sen', 'biz', 'ular'], explanation_uz: 'мы - biz.' },
      { id: 'pronouns-2', type: 'fillBlank', prompt: '___ дома. = Biz uydamiz.', answer: 'Мы', explanation_uz: 'Biz - Мы.' },
    ],
  },
  {
    id: 'present-verbs',
    title: 'Hozirgi zamon fe’llari',
    subtitle: 'Я читаю, ты читаешь, он читает.',
    level: 'beginner',
    category: 'verbs',
    rule_uz: "Rus fe'li shaxsga qarab tuslanadi. Masalan читать: я читаю, ты читаешь, он читает.",
    examples: [
      { ru: 'Я читаю книгу.', uz: "Men kitob o'qiyapman." },
      { ru: 'Она работает.', uz: 'U ishlayapti.' },
    ],
    exercises: [
      { id: 'present-1', type: 'fillBlank', prompt: 'Я ___ книгу. (читать)', answer: 'читаю', explanation_uz: 'Я bilan читаю ishlatiladi.' },
      { id: 'present-2', type: 'choose', prompt: 'Он ___ дома. (работать)', answer: 'работает', choices: ['работаю', 'работаешь', 'работает'], explanation_uz: 'Он bilan работает.' },
    ],
  },
  {
    id: 'past-tense',
    title: 'O‘tgan zamon',
    subtitle: 'читал, читала, читали.',
    level: 'elementary',
    category: 'verbs',
    rule_uz: "O'tgan zamonda fe'l rod va ko'plikka moslashadi: он читал, она читала, они читали.",
    examples: [
      { ru: 'Он читал.', uz: "U o'qidi. (erkak)" },
      { ru: 'Она читала.', uz: "U o'qidi. (ayol)" },
    ],
    exercises: [
      { id: 'past-1', type: 'fillBlank', prompt: 'Она ___ книгу. (читать)', answer: 'читала', explanation_uz: 'Она bilan читала.' },
      { id: 'past-2', type: 'fillBlank', prompt: 'Они ___ дома. (работать)', answer: 'работали', explanation_uz: 'Они ko‘plik, shuning uchun работали.' },
    ],
  },
  {
    id: 'future-tense',
    title: 'Kelasi zamon',
    subtitle: 'буду читать, прочитаю.',
    level: 'elementary',
    category: 'verbs',
    rule_uz: "Imperfective fe'l bilan буду + infinitive ishlatiladi: я буду читать. Perfective fe'l esa bitta shaklda keladi: я прочитаю.",
    examples: [
      { ru: 'Я буду учить русский.', uz: "Men rus tilini o'rganaman." },
      { ru: 'Я прочитаю книгу.', uz: "Men kitobni o'qib tugataman." },
    ],
    exercises: [
      { id: 'future-1', type: 'fillBlank', prompt: 'Я ___ говорить по-русски. (буду/будешь)', answer: 'буду', explanation_uz: 'Я bilan буду.' },
      { id: 'future-2', type: 'choose', prompt: 'Мы ___ учить слова.', answer: 'будем', choices: ['буду', 'будешь', 'будем'], explanation_uz: 'Мы bilan будем.' },
    ],
  },
  {
    id: 'cases-intro',
    title: 'Kelishiklar kirish',
    subtitle: '6 ta kelishik nimaga kerak?',
    level: 'elementary',
    category: 'cases',
    rule_uz: "Rus tilida so'z gapdagi vazifasiga qarab o'zgaradi. Это студент. Я вижу студента. Я говорю со студентом.",
    examples: [
      { ru: 'Это брат.', uz: 'Bu aka/uka.' },
      { ru: 'Я вижу брата.', uz: "Men aka/ukani ko'ryapman." },
    ],
    exercises: [
      { id: 'cases-1', type: 'choose', prompt: 'Я вижу ___ (брат)', answer: 'брата', choices: ['брат', 'брата', 'братом'], explanation_uz: 'Кого? брата - tushum kelishigi.' },
      { id: 'cases-2', type: 'fillBlank', prompt: 'Я говорю с ___. (друг)', answer: 'другом', explanation_uz: 'С кем? с другом - творительный.' },
    ],
  },
  {
    id: 'prepositions-place',
    title: 'Joy predloglari',
    subtitle: 'в, на, из, с.',
    level: 'elementary',
    category: 'sentence',
    rule_uz: "в odatda ichkariga/ichida, на yuzaga/tadbirga ishlatiladi. Qayerdan: из va с.",
    examples: [
      { ru: 'Я в школе.', uz: 'Men maktabdaman.' },
      { ru: 'Я иду на работу.', uz: 'Men ishga ketyapman.' },
    ],
    exercises: [
      { id: 'prep-1', type: 'fillBlank', prompt: 'Я иду ___ школу.', answer: 'в', explanation_uz: 'школу bilan yo‘nalish: в школу.' },
      { id: 'prep-2', type: 'fillBlank', prompt: 'Он ___ работе.', answer: 'на', explanation_uz: 'на работе - ishda.' },
    ],
  },
  {
    id: 'adjective-agreement',
    title: 'Sifat moslashuvi',
    subtitle: 'новый, новая, новое, новые.',
    level: 'elementary',
    category: 'nouns',
    rule_uz: "Sifat otning rodi va soniga moslashadi: новый дом, новая книга, новое окно, новые дома.",
    examples: [
      { ru: 'новый дом', uz: 'yangi uy' },
      { ru: 'новая машина', uz: 'yangi mashina' },
    ],
    exercises: [
      { id: 'adj-1', type: 'fillBlank', prompt: '___ книга (новый)', answer: 'новая', explanation_uz: 'книга женский rod, shuning uchun новая.' },
      { id: 'adj-2', type: 'fillBlank', prompt: '___ окно (новый)', answer: 'новое', explanation_uz: 'окно средний rod, shuning uchun новое.' },
    ],
  },
  {
    id: 'questions',
    title: 'Savol gaplar',
    subtitle: 'Кто? Что? Где? Когда? Почему?',
    level: 'beginner',
    category: 'sentence',
    rule_uz: "Rus tilida savol so'zi gap boshida kelishi mumkin. Intonatsiya ham muhim: Ты дома? Где ты?",
    examples: [
      { ru: 'Где ты живёшь?', uz: 'Qayerda yashaysan?' },
      { ru: 'Что ты делаешь?', uz: 'Nima qilyapsan?' },
    ],
    exercises: [
      { id: 'q-1', type: 'choose', prompt: 'Где? nimani so‘raydi?', answer: 'qayerda', choices: ['kim', 'nima', 'qayerda', 'qachon'], explanation_uz: 'Где - qayerda.' },
      { id: 'q-2', type: 'translate', prompt: 'Nima qilyapsan? ruscha yozing', answer: 'Что ты делаешь?', explanation_uz: 'Что ты делаешь? - Nima qilyapsan?' },
    ],
  },
  {
    id: 'negation',
    title: 'Inkor gaplar',
    subtitle: 'не bilan inkor qilish.',
    level: 'beginner',
    category: 'sentence',
    rule_uz: "Fe'ldan oldin не qo'yiladi: Я не знаю. Он не работает.",
    examples: [
      { ru: 'Я не понимаю.', uz: 'Men tushunmayapman.' },
      { ru: 'Она не работает.', uz: 'U ishlamayapti.' },
    ],
    exercises: [
      { id: 'neg-1', type: 'transform', prompt: 'Я знаю. gapini inkor qiling', answer: 'Я не знаю.', explanation_uz: 'не fe’ldan oldin keladi.' },
      { id: 'neg-2', type: 'fillBlank', prompt: 'Он ___ работает.', answer: 'не', explanation_uz: 'Inkor uchun не ishlatiladi.' },
    ],
  },
  {
    id: 'motion-verbs',
    title: 'Harakat fe’llari',
    subtitle: 'идти, ходить, ехать, ездить.',
    level: 'intermediate',
    category: 'verbs',
    rule_uz: "идти/ехать hozir bitta yo'nalishdagi harakat; ходить/ездить odat, takror yoki borib-kelishni bildiradi.",
    examples: [
      { ru: 'Я иду в магазин.', uz: "Men do'konga ketyapman." },
      { ru: 'Я часто хожу в магазин.', uz: "Men tez-tez do'konga boraman." },
    ],
    exercises: [
      { id: 'motion-1', type: 'choose', prompt: 'Hozir do‘konga ketyapman: Я ___ в магазин.', answer: 'иду', choices: ['иду', 'хожу', 'ездил'], explanation_uz: 'Hozir bitta yo‘nalish: иду.' },
      { id: 'motion-2', type: 'choose', prompt: 'Men tez-tez maktabga boraman: Я часто ___ в школу.', answer: 'хожу', choices: ['иду', 'хожу', 'еду'], explanation_uz: 'Takroriy odat: хожу.' },
    ],
  },
];
