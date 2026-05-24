import fs from 'node:fs/promises';
import path from 'node:path';
import pdfParse from 'pdf-parse';

const ROOT = process.cwd();

const sources = [
  {
    file: 'C:/Users/Ikhti/Downloads/Telegram Desktop/имя_существительное_1000(1)(1)(1) (2).pdf',
    category: 'noun',
    category_ru: 'Имя существительное',
  },
  {
    file: 'C:/Users/Ikhti/Downloads/Telegram Desktop/имя_прилагательное_1000(1) (2).pdf',
    category: 'adjective',
    category_ru: 'Имя прилагательное',
  },
  {
    file: 'C:/Users/Ikhti/Downloads/Telegram Desktop/Глаголы_1000_та(1)(1) (2).pdf',
    category: 'verb',
    category_ru: 'Глаголы',
  },
];

function clean(value) {
  return value.replace(/\s+/g, ' ').replace(/[|•·]/g, ' ').trim();
}

function isRussian(value) {
  return /[А-Яа-яЁё]/.test(value) && !/[ҚқҒғҲҳЎў]/.test(value);
}

function isTranslation(value) {
  return /[A-Za-zА-Яа-яЁёҚқҒғҲҳЎў'`’ʻ -]/.test(value) && value.length > 1;
}

function looksLikeWord(value, category) {
  const word = clean(value).toLowerCase();
  if (!/^[а-яё -]+$/i.test(word)) return false;
  if (category === 'verb') return /(ть|ться|ти|чь|сти|зти)$/.test(word);
  if (category === 'adjective') return /(ый|ий|ой|ая|ое|ые|ого|ему|ущий|ющий|енный|альный|овый|ский|ной|кий|хий|жий)$/.test(word);
  return /^[а-яё-]{2,40}$/i.test(word);
}

function parseLine(line) {
  const normalized = clean(line)
    .replace(/^\d+\s*[-.)]?\s*/, '')
    .replace(/\s{2,}/g, '\t');

  const tabParts = normalized.split('\t').map(clean).filter(Boolean);
  if (tabParts.length >= 2 && isRussian(tabParts[0]) && isTranslation(tabParts.slice(1).join(' '))) {
    return { russian: tabParts[0], uzbek: tabParts.slice(1).join(' ') };
  }

  const match = normalized.match(/^([А-Яа-яЁё][А-Яа-яЁё -]{1,40})\s+(.{2,80})$/);
  if (!match) return null;

  const russian = clean(match[1]);
  const uzbek = clean(match[2]);
  if (!isRussian(russian) || !isTranslation(uzbek)) return null;
  if (/^(имя|глаголы|существительное|прилагательное|русча|узбекча)$/i.test(russian)) return null;
  return { russian, uzbek };
}

async function extractSource(source) {
  const buffer = await fs.readFile(source.file);
  const parsed = await pdfParse(buffer);
  const lines = parsed.text
    .split(/\r?\n/)
    .map(clean)
    .filter((line) => line.length > 2);

  if (source.category === 'adjective') {
    const adjectiveWords = parseAlternatingAdjectives(lines, source);
    if (adjectiveWords.length > 900) return adjectiveWords;
  }

  const words = [];
  const seen = new Set();

  for (const line of lines) {
    const parsedLine = parseLine(line);
    if (!parsedLine) continue;
    const key = `${source.category}:${parsedLine.russian.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    words.push({
      id: `${source.category}-${Math.floor(words.length / 20) + 1}-${(words.length % 20) + 1}`,
      russian: parsedLine.russian,
      uzbek: parsedLine.uzbek,
      category: source.category,
      category_ru: source.category_ru,
      page: Math.floor(words.length / 20) + 1,
    });
  }

  if (words.length < 500) {
    words.length = 0;
    seen.clear();
    for (let i = 0; i < lines.length - 1; i += 1) {
      const russian = clean(lines[i]);
      if (!looksLikeWord(russian, source.category)) continue;

      const translationParts = [];
      let cursor = i + 1;
      while (cursor < lines.length && !looksLikeWord(lines[cursor], source.category) && translationParts.length < 3) {
        const candidate = clean(lines[cursor]);
        if (candidate && !/^\d+$/.test(candidate)) translationParts.push(candidate);
        cursor += 1;
      }

      const uzbek = clean(translationParts.join(' '));
      if (!uzbek || !isTranslation(uzbek)) continue;
      const key = `${source.category}:${russian.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      words.push({
        id: `${source.category}-${Math.floor(words.length / 20) + 1}-${(words.length % 20) + 1}`,
        russian,
        uzbek,
        category: source.category,
        category_ru: source.category_ru,
        page: Math.floor(words.length / 20) + 1,
      });
      i = cursor - 2;
    }
  }

  return words;
}

function parseAlternatingAdjectives(lines, source) {
  const words = [];
  const seen = new Set();
  let i = lines.findIndex((line) => /имя прилагательное/i.test(line));
  i = i >= 0 ? i + 1 : 0;

  while (i < lines.length) {
    let russian = '';
    let uzbek = '';
    const current = clean(lines[i]);
    const inline = current.match(/^([а-яё-]{2,45})\s+(.{2,90})$/i);

    if (inline && looksLikeWord(inline[1], source.category)) {
      russian = clean(inline[1]);
      uzbek = clean(inline[2]);
      i += 1;
    } else {
      russian = current;
      uzbek = clean(lines[i + 1] ?? '');
      i += 2;
    }

    if (!looksLikeWord(russian, source.category) || !uzbek) continue;
    const key = `${source.category}:${russian.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    words.push({
      id: `${source.category}-${Math.floor(words.length / 20) + 1}-${(words.length % 20) + 1}`,
      russian,
      uzbek,
      category: source.category,
      category_ru: source.category_ru,
      page: Math.floor(words.length / 20) + 1,
    });
  }

  return words;
}

const allWords = [];
for (const source of sources) {
  console.log(`Reading ${source.file}`);
  const words = await extractSource(source);
  console.log(`  ${words.length} words parsed for ${source.category}`);
  allWords.push(...words);
}

if (allWords.length < 50) {
  throw new Error(`Only ${allWords.length} words parsed. Check PDF text layout before overwriting seedWords.ts.`);
}

const ts = `import type { Word } from '../types';
import words from './words.json';

export const SEED_WORDS = words as Word[];
`;

await fs.writeFile(path.join(ROOT, 'src/data/seedWords.ts'), ts, 'utf8');
await fs.writeFile(path.join(ROOT, 'src/data/words.json'), JSON.stringify(allWords, null, 2), 'utf8');
await fs.writeFile(path.join(ROOT, 'public/words.json'), JSON.stringify(allWords, null, 2), 'utf8');
console.log(`Done. ${allWords.length} words written to src/data/words.json, src/data/seedWords.ts and public/words.json`);
