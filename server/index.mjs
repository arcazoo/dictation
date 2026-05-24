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
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiModel = process.env.OPENAI_MODEL || 'gpt-5.2';

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
  const word = body?.word?.russian ? `${body.word.russian} - ${body.word.uzbek}` : 'tanlangan so‘z';
  return `Offline tutor rejimi.\n\nFokus: ${word}\n\nSavol: ${body?.message || body?.mode}\n\nMashq: ruscha so‘zni ayting, tarjimasini yoping, keyin o‘zingiz yozib ko‘ring.`;
}

async function askOpenAiTutor(body) {
  if (!openaiApiKey) return { ok: true, fallback: true, answer: tutorFallback(body) };

  const result = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: openaiModel,
      input: [
        {
          role: 'developer',
          content:
            'You are Ruscha Tez AI Tutor. Teach Russian vocabulary to Uzbek speakers. Reply in Uzbek Latin by default. Be short, practical, mobile-friendly, and quiz the learner.',
        },
        {
          role: 'user',
          content: JSON.stringify(body, null, 2),
        },
      ],
    }),
  });

  if (!result.ok) return { ok: false, error: await result.text() };
  const data = await result.json();
  return { ok: true, answer: data.output_text || 'AI javob bo‘sh qaytdi.' };
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
      const answer = await askOpenAiTutor(payload);
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
