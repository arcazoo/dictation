# Ruscha Tez

Ruscha Tez - ruscha-o'zbekcha so'zlarni active recall, spaced repetition, xato asosida takrorlash va yozma recall orqali yodlash uchun mobile-first PWA.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- IndexedDB offline database
- Custom service worker + `manifest.json`
- PDF import script: `scripts/import-pdfs.mjs`

## Ishga tushirish

```bash
npm install
npm run import:pdf
npm run dev
```

`npm run import:pdf` quyidagi PDFlardan so'zlarni chiqarib `src/data/seedWords.ts` va `public/words.json` fayllarini yaratadi:

- `C:/Users/Ikhti/Downloads/Telegram Desktop/имя_существительное_1000(1)(1)(1) (2).pdf`
- `C:/Users/Ikhti/Downloads/Telegram Desktop/имя_прилагательное_1000(1) (2).pdf`
- `C:/Users/Ikhti/Downloads/Telegram Desktop/Глаголы_1000_та(1)(1) (2).pdf`

PDF matni jadvaldan boshqacha chiqsa, `scripts/import-pdfs.mjs` ichidagi `parseLine` heuristikasini moslash kerak bo'ladi.

## Tuzilma

```text
src/
  components/      reusable UI
  data/            kategoriya, default settings, seed words
  db/              IndexedDB, export/import
  hooks/           app state orchestration
  lib/             SRS, lesson planner, written answer grading
  pages/           Home, Sections, Study, Test, Errors, Stats, Settings
public/
  manifest.json
  sw.js
  icon.svg
scripts/
  import-pdfs.mjs
```

## Database modeli

IndexedDB storelari:

- `words`: `Word`
- `progress`: `UserProgress`
- `settings`: `Settings`
- `events`: review/test tarixi

SRS level algoritmi:

- Level 0: yangi yoki noto'g'ri, 5-15 daqiqada qaytadi
- Level 1: 1 kun
- Level 2: 3 kun
- Level 3: 7 kun
- Level 4: 15 kun
- Level 5: 30 kun

## MVP ekranlari

- Bugungi dars
- Bo'limlar va varaq statuslari
- Flashcard
- 4 variantli test
- Yozma javob
- Xatolar
- Statistika
- Settings

## Keyingi kengaytirish

- Supabase/Firebase cloud sync
- Web push notification
- Har bir so'z uchun misol gap
- AI orqali gap yaratish
- Leaderboard
- PDF import UI
# dictation
# dictation
