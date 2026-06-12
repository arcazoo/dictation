# Ruscha Tez 3.0

Ruscha Tez — ruscha-o'zbekcha so'zlarni va **to'liq rus tili grammatikasini (A1→B1)** o'rganish uchun mobile-first web app. FSRS-5 spaced repetition, active recall, Duolingo-uslubidagi Learning Path, gamification va Gemini AI Coach bilan.

## Stack

- React 19 + Vite 7 + TypeScript
- Zustand — markaziy holat boshqaruvi
- ts-fsrs — FSRS-5 spaced repetition scheduler
- Tailwind CSS — dizayn tokenlari bilan
- IndexedDB — offline progress (v5 schema)
- Vitest — unit testlar
- Vercel serverless + Firebase Firestore backup + Gemini AI

## Ishga tushirish

```bash
npm install
npm run dev
```

Testlar va production build:

```bash
npm test
npm run build
npm run server   # http://127.0.0.1:4173
```

## Grammatika kursi

`src/content/grammar/` — 8 modul, 45 mavzu, ~370 mashq:

1. **Asos** — alifbo, urg'u/reduktsiya, yumshoqlik, olmoshlar, intonatsiya
2. **Ot va rod** — rod, ko'plik, jonlilik, egalik
3. **Kelishiklar** — 6 kelishik, har biri alohida mavzu + aralash drill
4. **Fe'l** — I/II tuslanish, noto'g'ri fe'llar, zamonlar, **aspekt (НСВ/СВ)**, -ся, buyruq
5. **Harakat fe'llari** — идти/ходить, juftliklar, prefikslar, transport
6. **Sifat va ravish** — moslashuv, qisqa shakl, qiyoslash
7. **Sintaksis** — savollar, который, чтобы/если, bilvosita nutq, sonlar, modallar
8. **Nutq amaliyoti** — kesim, ravishdosh, yuklamalar, muloqot odobi, dialoglar

Har mavzuda: nazariya jadvallar bilan, **o'zbek tili bilan solishtirish**, urg'u belgili misollar (TTS bilan), o'zbeklar qiladigan tipik xatolar, 8-12 ta drill mashq, mini dialog. Progress IndexedDB'da saqlanadi va 3-7 kunlik SRS interval bilan takrorga chiqadi.

## Arxitektura

```text
src/
  store/appStore.ts      Zustand — butun app holati va amallar
  content/grammar/       grammatika kursi kontenti (modul fayllari)
  lib/
    srs.ts               FSRS-5 scheduler (legacy progressdan avtomatik migratsiya)
    exercises.ts         Exercise Engine v2 (introduce -> recognition -> production)
    answer.ts            yozma javob baholash (lotin/kirill, Levenshtein)
  db/indexedDb.ts        IndexedDB v5 (grammarProgress qo'shildi)
  pages/                 sahifalar (GrammarPage, GrammarTopicPage yangi)
  hooks/useAppData.ts    store ustidagi moslik adapteri
```

So'zlar bazasi (2980 so'z) endi bundle ichida emas — `public/words.json` runtime'da yuklanadi va IndexedDB'da keshlash qilinadi (offline fallback: lazy chunk).

## Vercel serverless

- `api/health.js`, `api/backup.js` (endi grammarProgress ham saqlaydi), `api/tutor.js`

Environment variables:

```text
FIREBASE_PROJECT_ID=...
FIREBASE_API_KEY=...
FIREBASE_BACKUP_COLLECTION=ruschaTezBackups
FIREBASE_BACKUP_DOCUMENT=default
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

## SRS

ts-fsrs (FSRS-5): har so'z uchun individual stability/difficulty, request_retention 0.9, maksimal interval 365 kun. Eski 6-darajali jadvaldan saqlangan progress birinchi javobda avtomatik FSRS kartasiga aylanadi — foydalanuvchi ma'lumotlari yo'qolmaydi.

Javob → baho: wrong→Again, close/hard→Hard, correct→Good, tez+ishonchli correct→Easy.

## Keyingi qadamlar

- Lug'atni boyitish: urg'u belgilari, rod, aspekt juftlari, misol gaplar (`Word` tipida maydonlar tayyor)
- Firebase Auth + har user uchun alohida backup document
- AI structured quiz JSON'ni LessonPlayer bilan ulash
- Onboarding + daraja testi
