import type { GrammarTopic } from '../../types';

/** Modul 5 — Harakat fe'llari: idti/xodit, prefikslar, transport (A2) */
export const MODULE_5: GrammarTopic[] = [
  {
    id: 'm5-idti-khodit',
    module: 5,
    order: 1,
    level: 'A2',
    title: 'идти — ходить, ехать — ездить',
    subtitle: "Bir yo'nalish va ko'p yo'nalish",
    theory: [
      {
        heading: 'Ikki guruh',
        body: "Rus tilida 'bormoq' ikki fe'l bilan aytiladi: идти — HOZIR bitta yo'nalishda ketyapti; ходить — takror qatnaydi yoki borib-keladi. Xuddi shunday transportda: ехать (hozir ketyapti) — ездить (qatnaydi).",
        table: [
          ['Vaziyat', 'Piyoda', 'Transportda'],
          ["Hozir, bir yo'nalish", 'иду́', 'е́ду'],
          ['Takror / borib-kelish', 'хожу́', 'е́зжу'],
          ['Misol 1', 'Я иду́ в шко́лу (hozir)', 'Я е́ду на рабо́ту (hozir)'],
          ['Misol 2', 'Я хожу́ в шко́лу ка́ждый день', 'Я е́зжу на рабо́ту на метро́'],
        ],
      },
      {
        heading: 'ходить tuslanishi',
        body: 'хожу́, хо́дишь, хо́дит, хо́дим, хо́дите, хо́дят. ездить: е́зжу, е́здишь, е́здит... идти: иду́, идёшь... ехать: е́ду, е́дешь...',
      },
      {
        heading: "O'tgan zamonda",
        body: "ходил = borib keldi (u yerda bo'lib qaytdi): Вчера я ходил в кино (kinoga borib keldim). шёл = ketayotgan edi (jarayon): Когда я шёл домой, я встретил друга.",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha 'boryapman' (hozir) = иду/еду, 'boraman/qatnayman' (har kuni) = хожу/езжу, 'borib keldim' = ходил/ездил. Piyoda yoki transport farqi ham majburiy: yayov → идти/ходить, mashina-metro-avtobus → ехать/ездить.",
    examples: [
      { ru: 'Я иду́ в магази́н.', uz: 'Men do‘konga ketyapman (hozir, piyoda).' },
      { ru: 'Я хожу́ в спортза́л три ра́за в неде́лю.', uz: 'Sportzalga haftada uch marta qatnayman.' },
      { ru: 'Мы е́дем в Самарка́нд.', uz: 'Biz Samarqandga ketyapmiz (transportda).' },
      { ru: 'Он е́здит на рабо́ту на авто́бусе.', uz: 'U ishga avtobusda qatnaydi.' },
      { ru: 'Вчера́ я ходи́л к врачу́.', uz: 'Kecha shifokorga borib keldim.' },
    ],
    commonMistakes: [
      { wrong: 'Я иду в школу каждый день', right: 'Я хожу в школу каждый день', why_uz: 'Takror ish → ходить.' },
      { wrong: 'Я еду на работу пешком', right: 'Я иду на работу пешком', why_uz: 'Piyoda → идти; ехать faqat transport.' },
      { wrong: 'Вчера я шёл в кино (borib keldim ma’nosida)', right: 'Вчера я ходил в кино', why_uz: "Borib-qaytish fakti → ходил." },
    ],
    exercises: [
      { id: 'm5-ik-1', type: 'choose', prompt: 'Я сейчас ___ в школу. (piyoda)', answer: 'иду', choices: ['иду', 'хожу', 'еду', 'езжу'], explanation_uz: "Hozir bitta yo'nalish, piyoda → иду." },
      { id: 'm5-ik-2', type: 'choose', prompt: 'Я ___ в бассейн каждую субботу.', answer: 'хожу', choices: ['хожу', 'иду', 'еду', 'шёл'], explanation_uz: 'Takror → хожу.' },
      { id: 'm5-ik-3', type: 'choose', prompt: 'Мы ___ в Москву на поезде. (hozir)', answer: 'едем', choices: ['едем', 'идём', 'ездим', 'ходим'], explanation_uz: "Transport + hozir → едем." },
      { id: 'm5-ik-4', type: 'choose', prompt: 'Он ___ на работу на метро каждый день.', answer: 'ездит', choices: ['ездит', 'едет', 'ходит', 'идёт'], explanation_uz: 'Transport + takror → ездит.' },
      { id: 'm5-ik-5', type: 'choose', prompt: 'Вчера я ___ в театр. (borib keldim)', answer: 'ходил', choices: ['ходил', 'шёл', 'иду', 'хожу'], explanation_uz: 'Borib-qaytish fakti → ходил.' },
      { id: 'm5-ik-6', type: 'choose', prompt: 'Когда я ___ домой, начался дождь.', answer: 'шёл', choices: ['шёл', 'ходил', 'иду', 'хожу'], explanation_uz: "Jarayon o'tgan zamonda → шёл." },
      { id: 'm5-ik-7', type: 'conjugationDrill', prompt: 'ходить → я ...', answer: 'хожу', explanation_uz: 'д→ж: хожу.' },
      { id: 'm5-ik-8', type: 'conjugationDrill', prompt: 'ездить → я ...', answer: 'езжу', explanation_uz: 'езжу.' },
      { id: 'm5-ik-9', type: 'translate', prompt: 'Tarjima qiling: «Men universitetga avtobusda qatnayman»', answer: 'Я езжу в университет на автобусе', explanation_uz: 'takror + transport → езжу.' },
      { id: 'm5-ik-10', type: 'errorHunt', prompt: 'Xatoni toping: «Я еду в школу пешком каждый день»', answer: 'Я хожу в школу пешком каждый день', explanation_uz: 'Piyoda + takror → хожу.' },
    ],
  },
  {
    id: 'm5-other-pairs',
    module: 5,
    order: 2,
    level: 'A2',
    title: "Boshqa harakat fe'l juftlari",
    subtitle: 'бежать/бегать, лететь/летать, нести/носить',
    theory: [
      {
        heading: 'Asosiy juftliklar',
        body: "Hammasi bir xil printsip: birinchisi — hozir bir yo'nalishda, ikkinchisi — takror/ko'p yo'nalishda.",
        table: [
          ["Bir yo'nalish", "Ko'p yo'nalish", "Ma'no"],
          ['бежа́ть', 'бе́гать', 'yugurmoq'],
          ['лете́ть', 'лета́ть', 'uchmoq'],
          ['плыть', 'пла́вать', 'suzmoq'],
          ['нести́', 'носи́ть', 'olib bormoq (qo‘lda)'],
          ['везти́', 'вози́ть', 'olib bormoq (transportda)'],
          ['вести́', 'води́ть', 'boshlab bormoq / haydamoq'],
        ],
      },
      {
        heading: 'Misollar bilan',
        body: "Я бегу на работу (kechikyapman — hozir yuguryapman). Я бегаю по утрам (har kuni ertalab yuguraman). Самолёт летит в Москву (hozir). Я часто летаю в Москву (tez-tez).",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha 'yuguryapman' vs 'yuguraman (odat)' farqiga mos. носить yana 'kiyib yurmoq' ma'nosida ham ishlatiladi: Она носит очки — U ko'zoynak taqadi.",
    examples: [
      { ru: 'Я бегу́ на авто́бус!', uz: 'Avtobusga yuguryapman!' },
      { ru: 'Я бе́гаю ка́ждое у́тро.', uz: 'Har kuni ertalab yuguraman.' },
      { ru: 'Самолёт лети́т в Ташке́нт.', uz: 'Samolyot Toshkentga uchyapti.' },
      { ru: 'Она́ но́сит очки́.', uz: 'U ko‘zoynak taqib yuradi.', note: "kiyim/taqinchoq — doim носить" },
      { ru: 'Он во́дит маши́ну.', uz: 'U mashina haydaydi.' },
    ],
    commonMistakes: [
      { wrong: 'Я бегаю на автобус (hozir)', right: 'Я бегу на автобус', why_uz: "Hozir bitta yo'nalish → бегу." },
      { wrong: 'Она несёт очки (taqadi ma’nosida)', right: 'Она носит очки', why_uz: "Kiyib/taqib yurish — носить." },
    ],
    exercises: [
      { id: 'm5-op-1', type: 'choose', prompt: 'Смотри! Птица ___ . (uchyapti)', answer: 'летит', choices: ['летит', 'летает', 'лечу', 'летал'], explanation_uz: "Hozir, bir yo'nalish → летит." },
      { id: 'm5-op-2', type: 'choose', prompt: 'Я ___ по утрам в парке.', answer: 'бегаю', choices: ['бегаю', 'бегу', 'бежал', 'бежит'], explanation_uz: 'Odat → бегаю.' },
      { id: 'm5-op-3', type: 'choose', prompt: 'Она ___ очки.', answer: 'носит', choices: ['носит', 'несёт', 'возит', 'водит'], explanation_uz: 'Taqib yurish → носит.' },
      { id: 'm5-op-4', type: 'choose', prompt: 'Куда ты ___ эту сумку? (hozir, qo‘lda)', answer: 'несёшь', choices: ['несёшь', 'носишь', 'везёшь', 'водишь'], explanation_uz: "Hozir qo'lda olib ketyapti → несёшь." },
      { id: 'm5-op-5', type: 'choose', prompt: 'Папа ___ детей в школу на машине каждый день.', answer: 'возит', choices: ['возит', 'везёт', 'носит', 'водит'], explanation_uz: 'Transportda + takror → возит.' },
      { id: 'm5-op-6', type: 'choose', prompt: '«U mashina hayday oladi» — qaysi fe’l?', answer: 'водит', choices: ['водит', 'ведёт', 'возит', 'везёт'], explanation_uz: 'водить машину — mashina haydamoq.' },
      { id: 'm5-op-7', type: 'translate', prompt: 'Tarjima qiling: «Men suzishni bilaman / suzaman» (umuman)', answer: 'Я плаваю', explanation_uz: "Umumiy qobiliyat → ko'p yo'nalishli плавать." },
      { id: 'm5-op-8', type: 'errorHunt', prompt: 'Xatoni toping: «Я часто лечу в Москву»', answer: 'Я часто летаю в Москву', explanation_uz: 'часто → летаю.' },
    ],
  },
  {
    id: 'm5-prefixes',
    module: 5,
    order: 3,
    level: 'A2',
    title: "Prefiksli harakat fe'llari",
    subtitle: 'прийти, уйти, выйти, перейти',
    theory: [
      {
        heading: 'Prefiks = yo‘nalish',
        body: "идти/ехать ga prefiks qo'shilsa, harakat yo'nalishi aniqlashadi va fe'l СВ bo'ladi.",
        table: [
          ['Prefiks', "Ma'no", 'Misol'],
          ['при-', 'kelmoq', 'прийти́, прие́хать — Он пришёл домо́й'],
          ['у-', 'ketib qolmoq', 'уйти́, уе́хать — Она́ ушла́'],
          ['в-/во-', 'kirmoq', 'войти́ — Войди́те!'],
          ['вы-', 'chiqmoq', 'вы́йти — Он вы́шел из до́ма'],
          ['пере-', "o'tmoq (narigi tomonga)", 'перейти́ у́лицу'],
          ['до-', 'yetib bormoq', 'дойти́ до це́нтра'],
          ['за-', "kirib o'tmoq", 'зайти́ к дру́гу'],
          ['по-', 'boshlamoq/jo‘namoq', 'пойти́ — Пошли́!'],
        ],
      },
      {
        heading: 'Predloglar bilan mosligi',
        body: "при- + в/на/к, у- + из/с/от, вы- + из, до- + до: Он пришёл В школу. Он ушёл ИЗ школы. Я дошёл ДО площади. Prefiks va predlog ko'pincha juft ishlaydi.",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha ko'makchi fe'llarga juda o'xshash: kirIB bormoq=зайти, chiqIB ketmoq=выйти, yetIB bormoq=дойти, o'tIB olmoq=перейти. Prefiks o'zbek tilidagi ko'makchi fe'l vazifasini bajaradi.",
    examples: [
      { ru: 'Он пришёл домо́й в семь часо́в.', uz: 'U uyga soat yettida keldi.' },
      { ru: 'Она́ ушла́ с рабо́ты.', uz: 'U ishdan ketib qoldi.' },
      { ru: 'Вы́йдите на сле́дующей остано́вке?', uz: 'Keyingi bekatda tushasizmi?' },
      { ru: 'Как перейти́ у́лицу?', uz: 'Ko‘chadan qanday o‘tsa bo‘ladi?' },
      { ru: 'Зайди́ ко мне ве́чером.', uz: 'Kechqurun menikiga kirib o‘t.' },
      { ru: 'Пошли́ в кино́!', uz: 'Yur, kinoga!' },
    ],
    commonMistakes: [
      { wrong: 'Он пришёл из дома (uyga keldi ma’nosida)', right: 'Он пришёл домой', why_uz: 'при- kelish nuqtasi bilan: домой/в школу.' },
      { wrong: 'Я выйду из автобуса на остановке (told to wait?)', right: "to'g'ri, lekin выйти + из", why_uz: 'вы- doim из bilan: выйти из дома.' },
      { wrong: 'уйти в школу', right: 'уйти из школы / пойти в школу', why_uz: "у- 'ketib qolish' — qayerDAN ekanini bildiradi." },
    ],
    exercises: [
      { id: 'm5-pre-1', type: 'choose', prompt: '«U keldi» qaysi prefiks?', answer: 'пришёл', choices: ['пришёл', 'ушёл', 'вышел', 'перешёл'], explanation_uz: 'при- = kelish.' },
      { id: 'm5-pre-2', type: 'choose', prompt: '«U ketib qoldi (ayol)» qanday?', answer: 'ушла', choices: ['ушла', 'пришла', 'вошла', 'зашла'], explanation_uz: 'у- = ketish.' },
      { id: 'm5-pre-3', type: 'fillBlank', prompt: 'Он ___шел из комнаты. (chiqdi)', answer: 'вы', explanation_uz: 'вышел из — chiqdi.' },
      { id: 'm5-pre-4', type: 'fillBlank', prompt: 'Как ___йти улицу? (o‘tmoq)', answer: 'пере', explanation_uz: 'перейти улицу.' },
      { id: 'm5-pre-5', type: 'choose', prompt: '«Yetib bordim» qanday?', answer: 'дошёл', choices: ['дошёл', 'зашёл', 'пошёл', 'отошёл'], explanation_uz: 'до- = yetib borish.' },
      { id: 'm5-pre-6', type: 'choose', prompt: 'вы- prefiksi qaysi predlog bilan keladi?', answer: 'из', choices: ['из', 'в', 'к', 'до'], explanation_uz: 'выйти из дома.' },
      { id: 'm5-pre-7', type: 'translate', prompt: 'Tarjima qiling: «Kechqurun do‘stimnikiga kirib o‘taman» (зайти, друг)', answer: 'Вечером я зайду к другу', explanation_uz: 'зайти к + Д.п.' },
      { id: 'm5-pre-8', type: 'errorHunt', prompt: 'Xatoni toping: «Он пришёл из школу»', answer: 'Он пришёл из школы', explanation_uz: 'из + Р.п: из школы.' },
      { id: 'm5-pre-9', type: 'choose', prompt: '«Ketdik!» (taklif) qanday aytiladi?', answer: 'Пошли!', choices: ['Пошли!', 'Пришли!', 'Ушли!', 'Зашли!'], explanation_uz: 'Пошли! / Пойдём! — yur, ketdik.' },
    ],
  },
  {
    id: 'm5-transport',
    module: 5,
    order: 4,
    level: 'A2',
    title: 'Transport bilan gaplar',
    subtitle: 'на автобусе, на метро, пешком',
    theory: [
      {
        heading: 'на + П.п',
        body: "Transport vositasi на + П.п bilan: на автобусе, на машине, на метро, на поезде, на такси, на велосипеде. Piyoda — пешком (predlogsiz ravish).",
        table: [
          ['Vosita', 'Ruscha', 'Misol'],
          ['avtobusda', 'на авто́бусе', 'Я е́ду на авто́бусе'],
          ['mashinada', 'на маши́не', 'Мы е́дем на маши́не'],
          ['metroda', 'на метро́', "metro o'zgarmaydi"],
          ['poyezdda', 'на по́езде', 'Он е́дет на по́езде'],
          ['piyoda', 'пешко́м', 'Я иду́ пешко́м'],
        ],
      },
      {
        heading: 'Qancha vaqt ketadi',
        body: "Yo'l vaqti: До центра 20 минут на метро (Markazgacha metroda 20 daqiqa). Дорога занимает час (Yo'l bir soat oladi).",
      },
    ],
    comparisonWithUzbek:
      "O'zbekcha 'avtobusDA' = на автобусе — bu yerda ruscha на + П.п aynan '-da' ga mos. 'Piyoda' uchun esa alohida so'z: пешком.",
    examples: [
      { ru: 'Я е́зжу на рабо́ту на метро́.', uz: 'Ishga metroda qatnayman.' },
      { ru: 'Мы пое́дем туда́ на такси́.', uz: 'U yerga taksida boramiz.' },
      { ru: 'Идти́ пешко́м 10 мину́т.', uz: 'Piyoda 10 daqiqa.' },
      { ru: 'Ско́лько вре́мени е́хать до аэропо́рта?', uz: 'Aeroportgacha qancha vaqt yuriladi?' },
    ],
    commonMistakes: [
      { wrong: 'ехать с автобусом', right: 'ехать на автобусе', why_uz: 'Transport — на + П.п, с bilan emas.' },
      { wrong: 'идти на пешком', right: 'идти пешком', why_uz: 'пешком predlogsiz.' },
      { wrong: 'на метре', right: 'на метро', why_uz: "метро o'zgarmas so'z." },
    ],
    exercises: [
      { id: 'm5-tr-1', type: 'fillBlank', prompt: 'Я еду на работу ___ автобусе.', answer: 'на', explanation_uz: 'на + П.п.' },
      { id: 'm5-tr-2', type: 'transform', prompt: 'Kerakli shaklga: «Я еду на (машина)»', answer: 'машине', explanation_uz: 'на машине.' },
      { id: 'm5-tr-3', type: 'choose', prompt: '«piyoda» ruscha qanday?', answer: 'пешком', choices: ['пешком', 'на ногах', 'с ногами', 'ножно'], explanation_uz: 'идти пешком.' },
      { id: 'm5-tr-4', type: 'choose', prompt: 'metro bilan qaysi shakl?', answer: 'на метро', choices: ['на метро', 'на метре', 'в метро (transport sifatida)', 'с метро'], explanation_uz: "метро o'zgarmaydi: на метро." },
      { id: 'm5-tr-5', type: 'translate', prompt: 'Tarjima qiling: «Biz Samarqandga poyezdda boramiz»', answer: 'Мы поедем в Самарканд на поезде', explanation_uz: 'на поезде.' },
      { id: 'm5-tr-6', type: 'errorHunt', prompt: 'Xatoni toping: «Я еду домой с такси»', answer: 'Я еду домой на такси', explanation_uz: 'на такси.' },
    ],
    miniDialogue: [
      { speaker: 'A', ru: 'Как ты ездишь на работу?', uz: 'Ishga qanday qatnaysan?' },
      { speaker: 'B', ru: 'Обычно на метро, это быстро.', uz: 'Odatda metroda, bu tez.' },
      { speaker: 'A', ru: 'А сколько времени ехать?', uz: 'Qancha vaqt yuriladi?' },
      { speaker: 'B', ru: 'Минут двадцать. А потом я иду пешком пять минут.', uz: 'Yigirma daqiqacha. Keyin besh daqiqa piyoda yuraman.' },
    ],
  },
];
