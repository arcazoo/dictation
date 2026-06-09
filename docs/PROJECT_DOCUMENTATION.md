# Ruscha Tez 2.0 - To'liq loyiha hujjati

Oxirgi yangilanish: 2026-06-09  
Holat: production build muvaffaqiyatli, Vercel serverless + Firebase backup + Gemini AI Coach bilan ishlashga tayyor.

## 1. Loyiha maqsadi

**Ruscha Tez** - ruscha-o'zbekcha so'zlarni tez, tartibli va uzoq muddat esda saqlash uchun yaratilgan mobile-first web app. Loyiha endi oddiy flashcard/test ilovasi emas, balki Duolingo uslubidan ilhomlangan adaptive learning platforma sifatida qurilgan.

Asosiy vazifalar:

- ruscha so'zlarni bo'lim va varaq bo'yicha o'rgatish;
- foydalanuvchiga har kuni 5-10 daqiqalik dars berish;
- active recall, written recall, interleaving va spaced repetition metodikasini ishlatish;
- xato so'zlarni alohida kuzatish va "Mistake Repair" mashqlariga aylantirish;
- XP, streak, hearts, level va achievements orqali motivatsiya berish;
- Gemini AI Coach orqali tushuntirish, quiz, xato tahlili va daily plan berish;
- progressni IndexedDB ichida offline saqlash va Firebase Firestore orqali backup qilish.

## 2. Texnologiyalar

Frontend:

```text
React 19
Vite 7
TypeScript
Tailwind CSS
IndexedDB
Browser Text-to-Speech
```

Backend/API:

```text
Vercel Serverless Functions
Local Node.js production server
Firebase Firestore backup
Gemini API AI Coach
```

Data import:

```text
pdf-parse
scripts/import-pdfs.mjs
```

Deployment:

```text
Vercel frontend + /api routes
Firebase Firestore cloud backup
Google AI Studio Gemini key
```

## 3. Lug'at bazasi

Loyiha 3 ta PDFdan olingan ruscha-o'zbekcha lug'at bilan ishlaydi.

```text
Jami: 2980 ta so'z
noun       993 ta so'z, 50 varaq
adjective  987 ta so'z, 50 varaq
verb      1000 ta so'z, 50 varaq
```

Asosiy data fayllari:

```text
src/data/words.json
src/data/seedWords.ts
public/words.json
dist/words.json
```

PDF import qilish:

```bash
npm.cmd run import:pdf
```

## 4. Folder structure

```text
api/
  backup.js          Firebase Firestore backup API
  health.js          Vercel health check
  tutor.js           Gemini AI Coach serverless endpoint

docs/
  PROJECT_DOCUMENTATION.md

public/
  icon.svg
  manifest.json
  words.json

scripts/
  import-pdfs.mjs    PDF -> words.json import script

server/
  index.mjs          local production server + local API fallback

src/
  App.tsx            app routing and page orchestration
  main.tsx           React entry
  registerServiceWorker.ts
  types.ts           core TypeScript models

  components/
    Button.tsx
    Card.tsx
    Layout.tsx
    PageHeader.tsx
    StatTile.tsx
    WordCard.tsx

  data/
    categories.ts
    defaultSettings.ts
    seedWords.ts
    words.json

  db/
    indexedDb.ts     browser database, migrations, export/import

  hooks/
    useAppData.ts    main app state, persistence, backup sync

  lib/
    adaptiveLesson.ts
    answer.ts
    date.ts
    exercises.ts
    gamification.ts
    lesson.ts
    serverSync.ts
    source.ts
    srs.ts
    tutorApi.ts

  pages/
    ErrorsPage.tsx
    LearningPathPage.tsx
    LessonPlayerPage.tsx
    SectionsPage.tsx
    SettingsPage.tsx
    StatsPage.tsx
    StudyPage.tsx
    TestPage.tsx
    TodayPage.tsx
    TutorPage.tsx
```

## 5. App arxitekturasi

App oddiy state routing bilan ishlaydi. URL hash orqali ekran tanlanadi:

```text
#today
#path
#lesson
#sections
#study
#test
#ai
#errors
#stats
#settings
```

Asosiy boshqaruv fayli:

```text
src/App.tsx
```

State va browser database bilan ishlash:

```text
src/hooks/useAppData.ts
src/db/indexedDb.ts
```

UI shell:

```text
src/components/Layout.tsx
```

Mobile navigation:

```text
Bugun
Yo'l
List
AI
Settings
```

Desktopda sidebar ko'rinishida qo'shimcha ekranlar ham chiqadi:

```text
Xatolar
Statistika
```

## 6. Asosiy ekranlar

### 6.1 Home / Today

Fayl:

```text
src/pages/TodayPage.tsx
```

Ko'rsatadi:

- salomlashuv va kunlik dars;
- XP, level, streak, hearts;
- daily XP goal progress;
- bugungi yangi so'zlar va review soni;
- asosiy lesson card;
- Learning Path'ga tez o'tish;
- AI Coach va list/test shortcutlari.

### 6.2 Learning Path

Fayl:

```text
src/pages/LearningPathPage.tsx
```

Vazifasi:

- Unit -> Lesson -> Exercise strukturasini ko'rsatish;
- lesson statuslarini rang bilan ajratish;
- locked, available, completed, review_needed holatlarini boshqarish;
- har unit uchun progress foizini chiqarish.

Lesson statuslari:

```text
locked
available
in_progress
completed
review_needed
```

### 6.3 Lesson Player

Fayl:

```text
src/pages/LessonPlayerPage.tsx
```

Vazifasi:

- bitta lesson ichida turli exercise turlarini ishlatish;
- top progress bar;
- hearts indikator;
- savol card;
- choice, token builder va written input UI;
- Check/Continue flow;
- feedback panel;
- lesson tugaganda score, XP, mistakes va results saqlash.

### 6.4 Sections / List tanlash

Fayl:

```text
src/pages/SectionsPage.tsx
```

Vazifasi:

- Существительные, Прилагательные, Глаголы bo'limlarini ko'rsatish;
- har bir bo'lim ichida 50 tagacha varaq;
- varaq bo'yicha flashcard yoki test boshlash;
- varaq statusini ko'rsatish.

### 6.5 Flashcard

Fayl:

```text
src/pages/StudyPage.tsx
```

Vazifasi:

- ruscha so'zni old tomonda ko'rsatish;
- tarjimani user talab qilganda ochish;
- Bilaman, Qiyin, Bilmayman javoblarini SRS'ga yuborish;
- Text-to-Speech orqali ruscha talaffuz berish;
- eski MVP flow'ni saqlab turish.

### 6.6 Test

Fayl:

```text
src/pages/TestPage.tsx
```

Vazifasi:

- 4 variantli test;
- yozma javob;
- ruscha -> o'zbekcha va o'zbekcha -> ruscha direction;
- list/category/page bo'yicha test;
- xato javobni progress va errors tizimiga yozish.

### 6.7 Mistakes

Fayl:

```text
src/pages/ErrorsPage.tsx
```

Ko'rsatadi:

- ruscha so'z;
- tarjima;
- category;
- wrong_count;
- last_seen;
- next_review.

Maqsad:

- xatolarni oddiy ro'yxat emas, alohida qayta ishlash manbasi qilish;
- "Faqat xato so'zlarni takrorlash" tugmasi orqali Mistake Repair flow boshlash.

### 6.8 Stats

Fayl:

```text
src/pages/StatsPage.tsx
```

Ko'rsatadi:

- level;
- umumiy XP;
- streak;
- hearts;
- daily XP goal;
- bugungi javoblar va aniqlik;
- haftalik activity barlari;
- category progress;
- kuchsiz bo'limlar;
- achievements preview;
- eng qiyin so'zlar.

### 6.9 AI Coach

Fayl:

```text
src/pages/TutorPage.tsx
```

Vazifasi:

- AI bilan chat;
- tanlangan list bo'yicha savol-javob;
- active word tushuntirish;
- xatolarni tahlil qilish;
- quiz generatsiya qilish;
- chat history saqlash;
- chatni tozalash.

AI modes:

```text
chat
explain
examples
quiz
mistakes
dailyCoach
lessonFeedback
grammarHelp
adaptivePlan
```

### 6.10 Settings

Fayl:

```text
src/pages/SettingsPage.tsx
```

Bo'limlar:

- kunlik reja;
- test sozlamalari;
- takrorlash sozlamalari;
- til va tarjima ko'rinishi;
- reminder vaqtlari;
- ovoz va talaffuz;
- dizayn;
- progress boshqaruvi;
- JSON export/import;
- server backup/restore.

## 7. Learning Path algoritmi

Fayl:

```text
src/lib/adaptiveLesson.ts
```

Vazifasi:

- 2980 ta so'zni unit va lessonlarga bo'lish;
- category/page asosida lessonlar yaratish;
- review va mixed challenge lessonlarini qo'shish;
- progress asosida locked/available/completed/review_needed holatini hisoblash;
- confidence va due review holatiga qarab darslarni qayta belgilash.

Hozirgi unit mantiqi:

```text
10 ta unit
har unit taxminan 5 varaq atrofida
lesson turlari: page, review, mixedChallenge, mistakeRepair
```

## 8. Daily Lesson Engine

Asosiy fayllar:

```text
src/lib/lesson.ts
src/lib/adaptiveLesson.ts
```

Daily lesson quyidagilardan tuziladi:

- settings bo'yicha yangi so'zlar;
- next_review <= today bo'lgan review so'zlar;
- wrong_count yuqori so'zlar;
- qiyin va confidence past so'zlar;
- mixed/category tartib.

Bu engine eski flashcard/test sahifalarida ham, yangi lesson player'da ham ishlatiladi.

## 9. Exercise Engine

Fayl:

```text
src/lib/exercises.ts
```

Exercise type:

```ts
type ExerciseType =
  | 'multipleChoiceRuUz'
  | 'multipleChoiceUzRu'
  | 'writtenRecall'
  | 'wordBuilder'
  | 'sentenceBuilder'
  | 'fillBlank'
  | 'listenChoose'
  | 'mistakeDrill'
  | 'speedRound'
  | 'aiExample';
```

Exercise interface:

```ts
interface Exercise {
  id: string;
  lesson_id: string;
  type: ExerciseType;
  word: Word;
  prompt: string;
  choices?: string[];
  correctAnswer: string;
  tokens?: string[];
  sentence?: string;
  blank?: string;
}
```

Hozirgi holatda exercise engine local data asosida mashqlar yaratadi. AI generated example keyingi bosqichda Gemini endpoint orqali structured JSON bilan yanada kuchaytiriladi.

## 10. Adaptive SRS

Fayl:

```text
src/lib/srs.ts
```

UserProgress modeli:

```ts
interface UserProgress {
  word_id: string;
  level: number;
  correct_count: number;
  wrong_count: number;
  last_seen: string;
  next_review: string;
  status: 'new' | 'learning' | 'difficult' | 'known' | 'mastered';
  ease_factor?: number;
  interval_days?: number;
  lapses?: number;
  average_response_ms?: number;
  confidence?: number;
}
```

Level jadvali:

```text
Level 0: yangi yoki noto'g'ri, 5-15 daqiqada qaytadi
Level 1: 1 kun
Level 2: 3 kun
Level 3: 7 kun
Level 4: 15 kun
Level 5: 30 kun
```

Adaptive faktorlar:

- wrong_count;
- correct_count;
- close answer;
- response speed;
- lapses;
- ease_factor;
- average_response_ms;
- confidence 0-100.

Natija:

- tez va to'g'ri javob confidence'ni oshiradi;
- close/hard javob confidence'ni ozroq tushiradi;
- wrong/unknown javob level 0 va tez review beradi;
- repeated mistake lapses va wrong_count orqali ko'proq ko'rinadi.

## 11. Written Answer Grading

Fayl:

```text
src/lib/answer.ts
```

Baholash:

```text
correct
close
wrong
```

Tekshiradi:

- matn normalizatsiyasi;
- lotin/kirill yozuv farqlarini yumshatish;
- slash, vergul bilan berilgan tarjima variantlari;
- Levenshtein distance orqali "yaqin" javob.

## 12. Gamification

Fayl:

```text
src/lib/gamification.ts
```

Qo'shilgan tizimlar:

- XP;
- daily XP goal;
- streak;
- hearts;
- level;
- achievements;
- daily activity;
- exercise result tracking.

XP qoidalari:

```text
correct/known: +10 XP
close/hard: +5 XP
qiyin so'zni to'g'ri topish: bonus
mistake recovery: bonus
daily goal va perfect lesson bonuslari uchun model tayyor
```

UserProfile:

```ts
interface UserProfile {
  id: string;
  name: string;
  created_at: string;
  total_xp: number;
  level: number;
  streak: number;
  last_active_date: string;
  hearts: number;
  daily_goal_xp: number;
  daily_goal_minutes: number;
  hearts_enabled: boolean;
}
```

Achievements:

```text
3 kun streak
7 kun streak
30 kun streak
100 mastered
500 javob
first perfect lesson uchun model
```

## 13. IndexedDB modeli

Fayl:

```text
src/db/indexedDb.ts
```

Database:

```text
ruscha-tez-db
```

Version:

```text
3
```

Storelar:

```text
words
progress
settings
events
tutorMessages
userProfile
lessonProgress
achievements
dailyActivity
exerciseResults
```

Muhim qoida:

- eski `progress`, `settings`, `events`, `tutorMessages` storelari buzilmaydi;
- migration faqat yangi storelarni qo'shadi;
- export/import yangi fieldlarni ham qamrab oladi.

## 14. Server backup

Frontend:

```text
src/lib/serverSync.ts
src/hooks/useAppData.ts
src/pages/SettingsPage.tsx
```

Vercel API:

```text
api/backup.js
```

Local API:

```text
server/index.mjs
```

Cloud provider:

```text
Firebase Firestore
```

Backup payload ichida:

```text
progress
settings
events
tutorMessages
userProfile
lessonProgress
achievements
dailyActivity
exerciseResults
```

Auto backup ishlaydi:

- har bir review/test/exercise javobidan keyin;
- lesson tugaganda;
- settings o'zgarganda;
- progress yoki xatolar tozalanganda;
- internet qaytganda.

Manual backup:

```text
Settings -> Server backup
```

Manual restore:

```text
Settings -> Serverdan yuklash
```

Firebase env:

```text
FIREBASE_PROJECT_ID
FIREBASE_API_KEY
FIREBASE_BACKUP_COLLECTION
FIREBASE_BACKUP_DOCUMENT
```

Default:

```text
ruschaTezBackups/default
```

## 15. AI Coach

Frontend:

```text
src/pages/TutorPage.tsx
src/lib/tutorApi.ts
```

Backend:

```text
api/tutor.js
server/index.mjs
```

Provider:

```text
Gemini API
```

Default model:

```text
gemini-2.5-flash
```

Vercel env:

```text
GEMINI_API_KEY
GEMINI_MODEL
```

AI context:

- user message;
- selected mode;
- active word;
- selected list words;
- learner stats;
- recent mistakes;
- chat history;
- bugungi dars holati.

Prompt talablari:

- javob Uzbek Latin tilida;
- ruscha so'zlar aniq yoziladi;
- javob qisqa, o'qituvchi uslubida;
- quiz mode user javobini ham tekshiradi;
- `GEMINI_API_KEY` bo'lmasa chiroyli fallback xabar qaytadi.

## 16. PWA va cache holati

Manifest mavjud:

```text
public/manifest.json
```

Icon:

```text
public/icon.svg
```

Service worker hozir ataylab ishlatilmaydi.

Sabab:

- eski service worker cache oq ekran muammosi bergan;
- foydalanuvchi "sw js saqlamasin, umuman kerak emas" degan talab qo'ygan.

Fayl:

```text
src/registerServiceWorker.ts
```

Hozirgi vazifasi:

- eski service workerlarni unregister qilish;
- eski Cache Storage'ni tozalash;
- app yangi deploymentdan keyin eski buildga yopishib qolmasligi.

Natija:

- Vercel'da yangi build telefonda ham ochiladi;
- eski cache sabab oq ekran chiqmasligi kerak;
- offline progress IndexedDB'da turadi, lekin full offline app-shell cache hozir yo'q.

## 17. Environment variables

Vercel `Project -> Settings -> Environment Variables` ichida:

```text
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_API_KEY=your-firebase-web-api-key
FIREBASE_BACKUP_COLLECTION=ruschaTezBackups
FIREBASE_BACKUP_DOCUMENT=default
GEMINI_API_KEY=your-google-ai-studio-api-key
GEMINI_MODEL=gemini-2.5-flash
```

Muhim:

- OpenAI quota muammosi sabab AI provider Gemini'ga o'tkazilgan;
- API key frontendga qo'yilmaydi;
- key faqat Vercel env yoki local server env ichida turishi kerak.

## 18. Local development

Dependency o'rnatish:

```bash
npm.cmd install
```

Dev server:

```bash
npm.cmd run dev
```

Production build:

```bash
npm.cmd run build
```

Local production server:

```bash
npm.cmd run server
```

Local server:

```text
http://127.0.0.1:4173
```

Vercel health check:

```text
/api/health
```

Backup endpoint:

```text
/api/backup
```

Tutor endpoint:

```text
/api/tutor
```

## 19. Production ishlashi

Vercel'da:

```text
Build command: npm.cmd run build
Output directory: dist
```

Telefonda ishlash:

- sayt Vercel domenida ochiladi;
- Android browserda mobile-first layout ishlaydi;
- IndexedDB progressni telefonda saqlaydi;
- server backup yoqilgan bo'lsa progress Firestore'ga real-timega yaqin yuboriladi;
- browser refresh yoki qayta kirishda progress IndexedDB'dan tiklanadi;
- service worker cache bo'lmagani uchun yangi deployment tezroq ko'rinadi.

## 20. Ma'lumot oqimlari

Review/exercise flow:

```text
User javob beradi
-> reviewWord()
-> SRS progress update
-> XP/hearts/dailyActivity update
-> ExerciseResult save
-> IndexedDB save
-> auto backup /api/backup
-> Firestore payload update
```

Lesson flow:

```text
Learning Path
-> Lesson Player
-> exercises generated
-> check answers
-> feedback
-> LessonProgress save
-> stats/profile update
-> backup
```

AI flow:

```text
TutorPage
-> selected context/list/history
-> /api/tutor
-> Gemini
-> assistant message
-> IndexedDB tutorMessages
```

Restore flow:

```text
Settings
-> Serverdan yuklash
-> /api/backup GET
-> IndexedDB importData()
-> reload()
```

## 21. Muhim kod modullari

Core:

```text
src/App.tsx
src/hooks/useAppData.ts
src/types.ts
```

Database:

```text
src/db/indexedDb.ts
```

Learning:

```text
src/lib/adaptiveLesson.ts
src/lib/exercises.ts
src/lib/lesson.ts
src/lib/srs.ts
src/lib/answer.ts
```

Gamification:

```text
src/lib/gamification.ts
```

AI:

```text
src/pages/TutorPage.tsx
src/lib/tutorApi.ts
api/tutor.js
```

Backup:

```text
src/lib/serverSync.ts
api/backup.js
server/index.mjs
```

UI:

```text
src/components/Layout.tsx
src/pages/TodayPage.tsx
src/pages/LearningPathPage.tsx
src/pages/LessonPlayerPage.tsx
src/pages/StatsPage.tsx
```

## 22. Hozir bajarilgan 2.0 ishlar

Bajarilgan:

- Types va data model yangilandi;
- IndexedDB version 3 migration qo'shildi;
- userProfile, lessonProgress, achievements, dailyActivity, exerciseResults storelari qo'shildi;
- gamification logic yaratildi;
- adaptive lesson engine yaratildi;
- 10 exercise type engine yaratildi;
- LessonPlayer sahifasi yaratildi;
- LearningPath sahifasi yaratildi;
- Today/Home sahifasi XP, level, streak, hearts bilan yangilandi;
- Stats sahifasi 2.0 ko'rsatkichlari bilan yangilandi;
- AI Tutor mode'lari AI Coach darajasiga kengaytirildi;
- Firestore backup yangi fieldlarni ham saqlaydi;
- chat history IndexedDB'da saqlanadi;
- service worker eski cache muammosi qaytarilmadi;
- `npm.cmd run build` muvaffaqiyatli o'tdi.

## 23. Hozirgi cheklovlar

Bundle katta:

- `src/data/words.json` app bundle ichida;
- Vite 500 kB warning beradi;
- build ishlaydi, lekin keyingi optimizatsiyada words lazy-load qilinishi kerak.

Full offline app-shell yo'q:

- progress offline saqlanadi;
- app-shell service worker bilan cache qilinmaydi;
- bu ataylab qilingan, chunki eski SW oq ekran muammosini bergan.

AI structured JSON hali to'liq UI bilan bog'lanmagan:

- prompt mode tayyor;
- keyingi bosqichda AI quiz JSON'ni lesson player ichida ishlatish mumkin.

Firebase Auth yo'q:

- hozir backup bitta documentga ishlaydi;
- ko'p user uchun Firebase Auth va user-specific document kerak.

## 24. Keyingi rivojlantirish yo'li

Tavsiya qilingan keyingi ishlar:

1. Firebase Auth yoki Google login qo'shish.
2. Har user uchun alohida backup document yaratish.
3. `words.json`ni category/page bo'yicha lazy-load qilish.
4. AI structured quiz JSON'ni LessonPlayer bilan ulash.
5. AI generated example sentence'larni so'z bazasiga saqlash.
6. Hearts restore va daily goal bonusni lesson summary bilan yanada kuchaytirish.
7. Settings ichida daily goal minutes/xp va hearts on/off UI qo'shish.
8. Mistake Repair'ni alohida lesson type sahifasiga yanada chuqurroq qilish.
9. Admin panel: words edit, PDF import, category manage.
10. Web push notificationni Firebase Messaging bilan qo'shish.

## 25. Qisqa xulosa

Ruscha Tez 2.0 hozir quyidagi imkoniyatlarga ega:

- real PDFlardan olingan 2980 ta so'zli lug'at;
- mobile-first React/TypeScript app;
- Duolingo-style Learning Path;
- adaptive Lesson Player;
- 10 xil exercise type modeli;
- flashcard, 4 variantli test, written recall;
- spaced repetition va confidence tracking;
- xatolarni alohida saqlash;
- XP, streak, hearts, level, achievements;
- AI Coach with Gemini;
- AI chat history;
- Firebase Firestore backup;
- Vercel production API;
- service worker cache muammosisiz deployment;
- JSON export/import;
- production build success.

