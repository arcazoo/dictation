/**
 * Lug'at bazasini tozalash:
 * 1. PDF parse xatolari: ruscha maydonga yopishib qolgan o'zbekcha so'zlarni tarjimaga qaytarish
 *    ("иметь Эга" = "бўлмоқ"  →  "иметь" = "эга бўлмоқ")
 * 2. Bosh harflarni normallashtirish (hammasi kichik harf)
 * 3. Dublikatlarni birlashtirish (tarjimalar vergul bilan qo'shiladi)
 * 4. Ma'lum xato tarjimalarni tuzatish
 * 5. Har so'zga uzbek_latin (lotin transliteratsiya) qo'shish
 *
 * Ishga tushirish: node scripts/clean-words.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = ['public/words.json', 'src/data/words.json'];

/** Aniqlangan xato tarjimalar uchun qo'lda tuzatishlar */
const CORRECTIONS = {
  'мочь': 'қила олмоқ',
};

/** PDF'da ruscha so'zi butunlay yo'qolgan, tiklab bo'lmaydigan yozuvlar */
const REMOVE_IDS = new Set(['verb-21-15', 'verb-42-5']);

/** O'zbek kirill -> lotin (1995 standart) */
function uzCyrillicToLatin(text) {
  let result = text;
  // So'z boshidagi е -> ye
  result = result.replace(/(^|[\s,;\-(])е/g, '$1ye').replace(/(^|[\s,;\-(])Е/g, '$1Ye');
  const map = [
    ['ў', "o'"], ['Ў', "O'"], ['ғ', "g'"], ['Ғ', "G'"], ['қ', 'q'], ['Қ', 'Q'], ['ҳ', 'h'], ['Ҳ', 'H'],
    ['ё', 'yo'], ['Ё', 'Yo'], ['ю', 'yu'], ['Ю', 'Yu'], ['я', 'ya'], ['Я', 'Ya'],
    ['ц', 'ts'], ['Ц', 'Ts'], ['ч', 'ch'], ['Ч', 'Ch'], ['ш', 'sh'], ['Ш', 'Sh'], ['щ', 'sh'], ['Щ', 'Sh'],
    ['ж', 'j'], ['Ж', 'J'], ['х', 'x'], ['Х', 'X'], ['э', 'e'], ['Э', 'E'], ['е', 'e'], ['Е', 'E'],
    ['а', 'a'], ['А', 'A'], ['б', 'b'], ['Б', 'B'], ['в', 'v'], ['В', 'V'], ['г', 'g'], ['Г', 'G'],
    ['д', 'd'], ['Д', 'D'], ['з', 'z'], ['З', 'Z'], ['и', 'i'], ['И', 'I'], ['й', 'y'], ['Й', 'Y'],
    ['к', 'k'], ['К', 'K'], ['л', 'l'], ['Л', 'L'], ['м', 'm'], ['М', 'M'], ['н', 'n'], ['Н', 'N'],
    ['о', 'o'], ['О', 'O'], ['п', 'p'], ['П', 'P'], ['р', 'r'], ['Р', 'R'], ['с', 's'], ['С', 'S'],
    ['т', 't'], ['Т', 'T'], ['у', 'u'], ['У', 'U'], ['ф', 'f'], ['Ф', 'F'],
    ['ы', 'i'], ['Ы', 'I'], ['ъ', "'"], ['ь', ''],
  ];
  for (const [cyr, lat] of map) result = result.split(cyr).join(lat);
  return result;
}

function clean(words) {
  const stats = { leakFixed: 0, merged: 0, corrected: 0 };
  const byRussian = new Map();
  const cleaned = [];

  for (const item of words) {
    if (REMOVE_IDS.has(item.id)) continue;
    let russian = item.russian.trim().replace(/\s+/g, ' ');
    let uzbek = item.uzbek.trim().replace(/\s+/g, ' ');

    // 1. Parse xatosi: birinchi tokendan keyin BOSH harfli token — o'zbekcha bo'lagi
    const tokens = russian.split(' ');
    if (tokens.length > 1) {
      const leakIndex = tokens.findIndex((token, index) => index > 0 && /^[А-ЯЁЎҚҒҲ]/.test(token));
      if (leakIndex > 0) {
        const moved = tokens.slice(leakIndex).join(' ');
        russian = tokens.slice(0, leakIndex).join(' ');
        uzbek = `${moved} ${uzbek}`.trim();
        stats.leakFixed += 1;
      }
    }

    // 2. Hamma narsani kichik harfga
    russian = russian.toLowerCase();
    uzbek = uzbek.toLowerCase();

    // 4. Qo'lda tuzatishlar
    if (CORRECTIONS[russian]) {
      uzbek = CORRECTIONS[russian];
      stats.corrected += 1;
    }

    // 3. Dublikat — tarjimalarni birlashtiramiz
    if (byRussian.has(russian)) {
      const existing = byRussian.get(russian);
      const parts = new Set(existing.uzbek.split(/\s*[,;]\s*/).filter(Boolean));
      uzbek.split(/\s*[,;]\s*/).filter(Boolean).forEach((part) => parts.add(part));
      existing.uzbek = [...parts].join(', ');
      existing.uzbek_latin = uzCyrillicToLatin(existing.uzbek);
      stats.merged += 1;
      continue;
    }

    const word = { ...item, russian, uzbek, uzbek_latin: uzCyrillicToLatin(uzbek) };
    byRussian.set(russian, word);
    cleaned.push(word);
  }

  return { cleaned, stats };
}

const source = JSON.parse(readFileSync(FILES[0], 'utf8'));
const { cleaned, stats } = clean(source);
// Ixcham format — words.json runtime'da tarmoqdan yuklanadi
const json = JSON.stringify(cleaned);
for (const file of FILES) writeFileSync(file, json, 'utf8');

console.log(`Jami: ${source.length} -> ${cleaned.length} so'z`);
console.log(`Parse xatosi tuzatildi: ${stats.leakFixed}`);
console.log(`Dublikat birlashtirildi: ${stats.merged}`);
console.log(`Qo'lda tuzatish: ${stats.corrected}`);
console.log('Namuna:', JSON.stringify(cleaned.find((w) => w.russian === 'иметь')));
console.log('Namuna:', JSON.stringify(cleaned.find((w) => w.russian === 'новый')));
