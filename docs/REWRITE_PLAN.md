# Ruscha Tez 3.0 — To'liq qayta yozish rejasi

Tuzilgan sana: 2026-06-12
Maqsad: loyihani eng zamonaviy metodika, mukammal dizayn va **to'liq rus tili grammatikasi** bilan noldan qayta qurish.

---

## 1. Hozirgi holat tahlili

### Kuchli tomonlar (saqlab qolinadi)
- 2980 so'zlik real lug'at bazasi (noun/adjective/verb, 150 varaq)
- SRS + active recall + written recall metodikasi ishlaydi
- Gamification (XP, streak, hearts, achievements)
- Gemini AI Coach (15 ta mode, speaking practice, IELTS scoring)
- IndexedDB offline progress + Firebase backup
- Vercel serverless deploy

### Zaif tomonlar (qayta yozishni talab qiladi)
| Muammo | Tafsilot |
|---|---|
| Routing | Hash-based qo'lbola routing, real router yo'q |
| State | Bitta gigant `useAppData` hook (394 qator), hammasi prop-drilling |
| Grammatika | Faqat 13 ta yuzaki mavzu, har birida 2 tagina mashq — bu rus tili emas, namuna xolos |
| So'z bazasi | Misol gaplar, urg'u belgilari, rod, ko'plik, aspekt juftliklari yo'q |
| SRS | Soddalashtirilgan level jadvali — zamonaviy FSRS emas |
| Bundle | words.json bundle ichida, 500kB+ warning, lazy-load yo'q |
| Offline | Service worker o'chirilgan — PWA to'liq emas |
| Test | Birorta avtomatik test yo'q |
| Dizayn | Komponentlar bor, lekin yagona dizayn tizimi (tokens, motion, a11y) yo'q |
| Auth | Bitta backup document — ko'p foydalanuvchi mumkin emas |

---

## 2. Yangi arxitektura

### 2.1 Texnologiyalar
```text
React 19 + TypeScript (strict)        — saqlanadi
Vite 7                                — saqlanadi
TanStack Router (yoki React Router 7) — hash routing o'rniga
Zustand + slices                      — useAppData o'rniga
Dexie.js                              — xom IndexedDB o'rniga (migration, typing, liveQuery)
Tailwind CSS 4 + dizayn tokenlari     — yangilanadi
Framer Motion                         — micro-animatsiyalar
ts-fsrs                               — zamonaviy FSRS-5 spaced repetition
Vitest + Testing Library              — testlar
vite-plugin-pwa (Workbox)             — to'g'ri service worker strategiyasi
```

### 2.2 Yangi papka tuzilmasi (feature-based)
```text
src/
  app/                 router, providers, shell
  features/
    vocabulary/        so'zlar, varaqlar, flashcard, test
    grammar/           grammatika kursi (asosiy yangi qism)
    lessons/           learning path, lesson player, exercise engine
    srs/               FSRS scheduler, review queue
    ai-coach/          tutor, speaking, listening
    gamification/      XP, streak, hearts, achievements
    stats/             statistika, heatmap, weak areas
    settings/          sozlamalar, backup, profil
  shared/
    ui/                dizayn tizimi komponentlari
    lib/               date, text, audio, levenshtein
    db/                Dexie schema + migrations (eski v3 dan import)
  content/
    words/             kategoriya bo'yicha bo'lingan JSON (lazy-load)
    grammar/           modul-modul grammatika kontenti
```

### 2.3 Ma'lumotlar oqimi
- Zustand store: `profile`, `srs`, `lesson`, `settings` slicelari
- Dexie `liveQuery` → UI reaktiv yangilanadi
- Words: kategoriya/varaq bo'yicha chunk qilingan JSON, `import()` bilan lazy-load
- Eski IndexedDB v3 dan **bir martalik migratsiya** — foydalanuvchi progressi yo'qolmaydi

---

## 3. To'liq rus tili grammatika kursi (yadro yangilik)

Hozirgi 13 mavzu o'rniga **A1 → B1+ to'liq tizimli kurs**: 8 modul, ~60 mavzu, har mavzuda 10–20 mashq.

### Modul 1 — Asos (A1.0)
1. Alifbo, harf-tovush mosligi, yozma/bosma shakllar
2. Urg'u va reduktsiya (о→а, е→и), urg'u belgilari bilan
3. Qattiq/yumshoq undoshlar, ь va ъ
4. Intonatsiya turlari (ИК-1..ИК-5)
5. Shaxs olmoshlari, "bu — ..." (это) gaplari
6. Rus tilida "to be" yo'qligi: Я студент

### Modul 2 — Ot va rod (A1)
7. Rod: мужской/женский/средний — qoidalar va istisnolar (время, кофе, папа)
8. Ko'plik: -ы/-и/-а/-я, istisnolar (человек→люди, ребёнок→дети)
9. Jonli/jonsiz otlar (одушевлённость)
10. Egalik olmoshlari: мой/моя/моё/мои to'liq paradigma

### Modul 3 — Kelishiklar I (A1) — har kelishik alohida chuqur mavzu
11. Kelishik tizimiga kirish: 6 kelishik nima uchun kerak (o'zbek kelishiklari bilan solishtirish jadvali)
12. Предложный: joy (в/на + П.п), o haqida (о + П.п)
13. Винительный: to'g'ridan-to'g'ri obyekt, jonli/jonsiz farqi
14. Родительный: yo'qlik (нет + Р.п), egalik (у меня есть), sanoq (2,3,4 + Р.п birlik; 5+ Р.п ko'plik)
15. Дательный: kimga (мне, тебе), yosh (Мне 20 лет), нравится konstruksiyasi
16. Творительный: bilan (с + Т.п), kasb (работать кем), fasl/payt
17. Kelishiklar umumiy jadvali + aralash drill (case detector mashqi)

### Modul 4 — Fe'l I (A1–A2)
18. I va II tuslanish (е-/и- tipi), -ать/-ить/-еть
19. Eng muhim noto'g'ri fe'llar: хотеть, мочь, есть, пить, жить, идти
20. O'tgan zamon: rod bo'yicha moslashish (-л/-ла/-ло/-ли)
21. Kelasi zamon: буду + infinitiv vs sovershenniy kelasi
22. **Fe'l aspekti (вид)** — НСВ/СВ: 4 mavzuga bo'lingan (ma'no, juftliklar, zamonlar bilan, buyruq bilan)
23. Refleksiv fe'llar (-ся): учиться, заниматься, нравиться
24. Buyruq mayli: -й/-и/-ь, aspekt tanlovi

### Modul 5 — Harakat fe'llari (A2) — ruscha eng qiyin mavzu, alohida modul
25. идти/ходить, ехать/ездить: unidirectional vs multidirectional
26. бежать/бегать, лететь/летать, плыть/плавать, нести/носить, везти/возить
27. Prefiksli harakat fe'llari: при-, у-, в-, вы-, по-, до-, пере-, за-
28. Transport bilan: на + П.п

### Modul 6 — Sifat, ravish, qiyoslash (A2)
29. Sifat moslashuvi: rod/son/kelishik bo'yicha to'liq paradigma
30. Qisqa shakl: рад, готов, должен, нужен
31. Qiyosiy daraja: -ее, более, istisnolar (лучше, хуже, больше)
32. Orttirma daraja: самый, -ейший
33. Ravishlar: хорошо/плохо, тоже/также farqi

### Modul 7 — Murakkab gap va sintaksis (A2–B1)
34. Savol so'zlari to'liq: кто/что/где/куда/откуда/когда/почему/зачем/сколько
35. который bilan ergash gaplar (kelishikda turlanishi)
36. чтобы, потому что, поэтому, если (shart gaplar, бы bilan)
37. Bilvosita nutq (косвенная речь)
38. Sonlar: turlanishi, vaqt aytish, sana, narx
39. Modal so'zlar: можно/нельзя/надо/нужно/должен + Д.п konstruksiyalari

### Modul 8 — B1+ va nutq amaliyoti
40. Faol/passiv kesim (причастия) — tanishuv darajasida
41. Ravishdosh (деепричастия) — tanishuv darajasida
42. Yuklamalar: же, ли, ведь, -то/-нибудь
43. Muloqot odobi: вы/ты, iltimos, uzr, telefon, rasmiy yozish
44. Real vaziyat dialoglari: do'kon, shifoxona, taksi, ish suhbati, bank (har biri grammatika drilli bilan)

### Grammatika kontent modeli (yangi)
```ts
interface GrammarTopic {
  id: string;
  module: number;
  level: 'A1' | 'A2' | 'B1';
  title: string;
  theory: GrammarSection[];        // qoidalar bosqichma-bosqich, jadvallar bilan
  comparisonWithUzbek?: string;    // o'zbek tili bilan solishtirish — eng kuchli o'rganish usuli
  paradigmTables?: ParadigmTable[];// turlash/tuslash jadvallari (interaktiv)
  examples: Example[];             // urg'u belgili, audioli misollar
  commonMistakes: Mistake[];       // o'zbeklar qiladigan tipik xatolar
  exercises: GrammarExercise[];    // 10-20 ta, 6 xil tur
  miniDialogue?: Dialogue;         // mavzuni jonli kontekstda
}
```

### Grammatika mashq turlari (hozirgi 4 o'rniga 8)
`choose`, `fillBlank`, `transform`, `translate`, `caseDetector` (kelishikni aniqlash), `conjugationDrill` (tuslash jadvalini to'ldirish), `sentenceBuilder` (token), `errorHunt` (xato gapni top va tuzat)

### Grammatika ham SRS ichida
Har mavzu va har paradigma katagi alohida SRS item bo'ladi — so'zlar bilan bir xil review navbatida aralashtiriladi (interleaving).

---

## 4. Lug'at bazasini boyitish

Har bir so'z uchun yangi maydonlar (skript + Gemini batch orqali generatsiya qilib, qo'lda tekshiriladi):
```ts
interface Word {
  id: string;
  russian: string;
  stressed: string;          // urg'u belgisi bilan: молокó
  uzbek: string;
  category: Category;
  gender?: 'м' | 'ж' | 'с';  // otlar uchun
  plural?: string;           // noto'g'ri ko'pliklar
  aspectPair?: string;       // fe'llar uchun НСВ↔СВ juftlik
  conjugationType?: 1 | 2;
  examples: { ru: string; uz: string }[];  // kamida 2 ta misol gap
  frequencyRank?: number;    // chastota bo'yicha tartiblash
  audio?: string;            // TTS yoki yozilgan audio
}
```
- So'zlarni **chastota bo'yicha** qayta tartiblash (eng kerakli 500 so'z birinchi unitlarda)
- PDF varaq tartibi saqlanadi, lekin "Smart tartib" rejimi default bo'ladi

---

## 5. O'rganish metodikasi (yangilangan)

1. **FSRS-5** (`ts-fsrs`) — hozirgi 6-level jadval o'rniga: har so'z uchun individual stability/difficulty, optimal interval
2. **Interleaving** — bitta darsda so'z + grammatika + listening aralash
3. **Spiral takrorlash** — har 5-darsdan keyin avtomatik "checkpoint" dars
4. **Production-first** — tanish (recognition) tezda yozish/aytishga (production) o'tadi: yangi so'z → MC → written → sentence → speaking
5. **Misol gap bilan o'rganish** — so'z hech qachon yolg'iz emas, doim gap ichida
6. **Xato genetikasi** — xato turini tasniflash (kelishik xatosi? aspekt? imlo?) va shu turga moslangan repair darslar
7. **Daily plan** — 3 blok: yangi (5-10 so'z) + review (FSRS navbati) + grammatika (1 mavzu yoki drill)

---

## 6. Dizayn tizimi (noldan)

### Tokens
- Ranglar: semantic palette (primary/success/danger/warn + surface qatlamlari), light/dark
- Typography: Inter (UI) + so'zlar uchun katta serif yoki ширина keng kirill shrift; urg'u belgisi alohida rang
- Spacing/radius/shadow scale, `prefers-reduced-motion` hurmat qilinadi

### Komponentlar (shared/ui)
Button, Card, Sheet (bottom sheet), Modal, Tabs, ProgressRing, ProgressBar, Streak flame, XP counter (animatsiyali), Confetti, Skeleton, Toast, EmptyState, ParadigmTable (interaktiv jadval)

### UX yangiliklari
- Lesson Player: Duolingo darajasidagi feedback (to'g'ri — yashil slide-up + haptic + sound, xato — izoh va to'g'ri javob)
- Learning Path: vertikal yo'l, unit bannerlari, checkpoint bekatlari
- Onboarding: 3 qadam (maqsad → daraja testi → kunlik reja) — daraja testi natijasiga ko'ra boshlanish nuqtasi
- Bottom nav: Bugun / Yo'l / Grammatika / AI / Profil
- Statistika: yillik heatmap (GitHub-style), kelishiklar bo'yicha aniqlik radari

---

## 7. Platforma va infratuzilma

1. **PWA to'liq tiklanadi**: `vite-plugin-pwa`, Workbox `NetworkFirst` (HTML) + `CacheFirst` (assets, words chunks) — eski "oq ekran" muammosi precache manifest + auto-update prompt bilan hal bo'ladi
2. **Firebase Auth** (Google login) + har user uchun alohida Firestore document; anonim rejim ham qoladi (localga)
3. **Sync**: debounce qilingan incremental backup (butun payload emas, o'zgargan storelar)
4. **Audio**: browser TTS saqlanadi + ruscha so'zlar uchun sifatli TTS cache
5. **AI Coach**: saqlanadi, lekin structured JSON (quiz/feedback) Lesson Player bilan to'liq ulanadi; grammatika mavzusiga bog'langan "AI tushuntir" tugmasi
6. **Testlar**: `srs`, `answer-grading`, `exercise-generator`, `grammar drill` uchun Vitest unit testlar; CI (GitHub Actions) build + test
7. **Bundle**: words lazy chunk, route-level code splitting — boshlang'ich bundle < 200kB

---

## 8. Bosqichma-bosqich amalga oshirish

### Bosqich 1 — Skelet (asos)
- Yangi loyiha tuzilmasi, router, Zustand, Dexie schema + eski v3 migratsiya
- Dizayn tokenlari va shared/ui komponentlari
- Words chunk qilish va lazy-load
- **Natija**: eski funksionallik yangi arxitekturada ishlaydi

### Bosqich 2 — O'rganish yadrosi
- FSRS-5 integratsiyasi, review queue
- Yangi Exercise Engine (10+ tur) va Lesson Player qayta yoziladi
- Lug'at boyitish skripti (urg'u, rod, aspekt, misollar)
- **Natija**: zamonaviy SRS bilan to'liq lesson flow

### Bosqich 3 — Grammatika kursi
- Kontent modeli + ParadigmTable komponenti
- 8 modul kontenti yoziladi (Modul 1–4 birinchi, 5–8 keyin)
- Grammatika SRS ga ulanadi, daily planga kiradi
- **Natija**: to'liq A1→B1 rus tili kursi

### Bosqich 4 — Gamification + Stats + AI
- XP/streak/hearts/achievements ko'chiriladi va kengaytiriladi (league, weekly quest)
- Yangi Stats (heatmap, kelishik radari, weak areas)
- AI Coach structured JSON ↔ Lesson Player
- **Natija**: to'liq motivatsiya tizimi

### Bosqich 5 — Platforma
- PWA (offline app-shell), Firebase Auth, per-user sync
- Onboarding + daraja testi
- Vitest testlar, CI, Vercel deploy
- **Natija**: production-ready 3.0

---

## 9. Saqlanadigan narsalar (qayta yozilmaydi)
- 2980 so'zlik baza (boyitiladi, lekin o'chmaydi)
- Foydalanuvchi progressi (migratsiya orqali)
- Gemini API endpointlari (`api/tutor.js` — kichik refactor)
- Firebase backup g'oyasi (auth qo'shiladi)
