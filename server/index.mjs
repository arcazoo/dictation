import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const dataDir = path.join(__dirname, 'data');
const backupFile = path.join(dataDir, 'progress-backup.json');
const port = Number(process.env.PORT || 4173);
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const modeInstructions = {
  chat: 'Answer the learner question and keep the conversation going.',
  explain: 'Explain the selected word or selected list in a simple way.',
  examples: 'Generate simple Russian example sentences and Uzbek Latin translations.',
  quiz: 'Create one quiz question from context_words. Wait for the learner answer.',
  mistakes: 'Analyze recent mistakes and give a short repair drill.',
  dailyCoach: 'Create a daily 5-10 minute plan based on stats, mistakes, and review words.',
  lessonFeedback: 'Give feedback about lesson performance and what to do next.',
  grammarHelp: 'Explain the needed Russian grammar point very simply.',
  adaptivePlan: 'Recommend the next exercise types and weak categories.',
  speakingPractice: 'Ask or evaluate a Russian speaking answer with scores and corrections.',
  listeningPractice: 'Create a Russian listening drill and check the learner answer.',
  ieltsSpeaking: 'Act like an IELTS Speaking examiner and score the answer.',
  rolePlay: 'Run a Russian role-play conversation and continue after correction.',
  audioConversation: 'Have a short voice-friendly Russian conversation.',
  strictMotivator: 'Give strict but respectful motivation and three concrete tasks.',
};
const toneInstructions = {
  kind: 'Be soft, patient, and encouraging.',
  normal: 'Be clear, direct, and teacher-like.',
  strict: 'Be strict and motivating without insults, profanity, threats, or identity attacks.',
  funnyStrict: 'Be funny-strict with playful pressure, but never insult or shame the learner.',
};

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function tutorFallback(body) {
  const word = body?.word?.russian ? `${body.word.russian} - ${body.word.uzbek}` : 'tanlangan soz';
  return `Offline tutor rejimi.\n\nFokus: ${word}\n\nSavol: ${body?.message || body?.mode}\n\nMashq: ruscha sozni ayting, tarjimasini yoping, keyin ozingiz yozib koring.`;
}

function buildTutorText(body) {
  return JSON.stringify(
    {
      role: 'Ruscha Tez AI Tutor',
      instruction:
        "You are the AI Coach of the Ruscha Tez app. Teach Russian to Uzbek speakers in Uzbek Latin. Be active, lively, short, and clear. Always correct mistakes and give the next drill. Write Russian in real Cyrillic. Never insult, shame, use profanity, discriminate, threaten, or attack identity. Strict tones must stay respectful.",
      modeInstruction: modeInstructions[body.mode] || modeInstructions.chat,
      toneInstruction: toneInstructions[body.tone] || toneInstructions.normal,
      jsonResponseRules:
        body.wantsJson || body.mode === 'speakingPractice' || body.mode === 'ieltsSpeaking'
          ? {
              requiredFormat: 'Return ONLY valid JSON. No markdown.',
              schema: {
                type: 'speakingFeedback',
                score: 72,
                ieltsBand: 5.5,
                fluency: 65,
                grammar: 70,
                vocabulary: 75,
                pronunciationEstimate: 60,
                relevance: 80,
                mistakes: [],
                betterAnswer_ru: 'Я иду в магазин.',
                betterAnswer_uz: "Men do'konga ketyapman.",
                nextQuestion_ru: 'Что ты обычно покупаешь в магазине?',
                motivation_uz: "Yomon emas, lekin fe'lni aniqroq ishlatamiz.",
              },
            }
          : null,
      ...body,
      contextWords: (body.contextWords || []).slice(0, 40),
      history: (body.history || []).slice(-10),
    },
    null,
    2,
  );
}

function readGeminiText(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim() || ''
  );
}

async function askGeminiTutor(body) {
  if (!geminiApiKey) return { ok: true, fallback: true, provider: 'offline', answer: tutorFallback(body) };

  const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': geminiApiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: buildTutorText(body) }],
        },
      ],
    }),
  });

  if (!result.ok) return { ok: false, provider: 'gemini', error: await result.text() };
  const data = await result.json();
  return { ok: true, provider: 'gemini', model: geminiModel, answer: readGeminiText(data) || 'AI javob bosh qaytdi.' };
}

function send(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(JSON.stringify(payload));
}

async function serveStatic(request, response) {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(distDir, safePath === '/' ? 'index.html' : safePath);

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch {
    filePath = path.join(distDir, 'index.html');
  }

  try {
    const ext = path.extname(filePath);
    const content = await fs.readFile(filePath);
    response.writeHead(200, { 'Content-Type': mime[ext] ?? 'application/octet-stream' });
    response.end(content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    send(response, 200, { ok: true });
    return;
  }

  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);

  try {
    if (url.pathname === '/api/health') {
      send(response, 200, { ok: true, app: 'Ruscha Tez', time: new Date().toISOString() });
      return;
    }

    if (url.pathname === '/api/backup' && request.method === 'GET') {
      const raw = await fs.readFile(backupFile, 'utf8').catch(() => '{}');
      send(response, 200, JSON.parse(raw));
      return;
    }

    if (url.pathname === '/api/backup' && request.method === 'POST') {
      const payload = await readBody(request);
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(backupFile, JSON.stringify({ ...payload, saved_at: new Date().toISOString() }, null, 2), 'utf8');
      send(response, 200, { ok: true, saved_at: new Date().toISOString() });
      return;
    }

    if (url.pathname === '/api/tutor' && request.method === 'POST') {
      const payload = await readBody(request);
      const answer = await askGeminiTutor(payload);
      send(response, answer.ok ? 200 : 500, answer);
      return;
    }

    await serveStatic(request, response);
  } catch (error) {
    send(response, 500, { ok: false, error: error instanceof Error ? error.message : 'Unknown server error' });
  }
});

server.listen(port, () => {
  console.log(`Ruscha Tez server: http://127.0.0.1:${port}`);
});
