const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

function fallbackReply(message, word) {
  const activeWord = word?.russian ? `${word.russian} - ${word.uzbek}` : 'tanlangan soz';
  return [
    'Men hozir offline tutor rejimidaman. GEMINI_API_KEY qoyilgach toliq AI javob beraman.',
    `Hozirgi fokus: ${activeWord}.`,
    `Savolingiz: ${message}`,
    'Mashq: ruscha sozni 3 marta ovoz chiqarib ayting, keyin tarjimasini yozib koring.',
  ].join('\n\n');
}

function buildTutorText(body) {
  const word = body.word;
  const stats = body.stats || {};
  const recentMistakes = body.recentMistakes || [];
  const contextWords = body.contextWords || [];

  return JSON.stringify(
    {
      role: 'Ruscha Tez AI Tutor',
      instruction:
        'Teach Russian vocabulary to Uzbek speakers. Reply in Uzbek Latin. Keep answers short, practical, mobile-friendly. Use simple Russian examples with Uzbek translations. Ask one quick question at the end.',
      mode: body.mode || 'chat',
      user_message: body.message,
      active_word: word
        ? {
            russian: word.russian,
            uzbek: word.uzbek,
            category: word.category_ru,
            page: word.page,
          }
        : null,
      context_title: body.contextTitle || null,
      context_words: contextWords.slice(0, 40).map((item) => ({
        russian: item.russian,
        uzbek: item.uzbek,
        category: item.category_ru,
        page: item.page,
      })),
      learner_stats: {
        learned: stats.learned,
        todayCount: stats.todayCount,
        accuracy: stats.accuracy,
        streak: stats.streak,
      },
      recent_mistakes: recentMistakes.slice(0, 8).map((item) => ({
        russian: item.russian,
        uzbek: item.uzbek,
        wrong_count: item.wrong_count,
      })),
      answer_format: '1 short explanation, 2 simple examples if useful, 1 quick question.',
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

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const body = request.body || {};
  if (!body.message && !body.mode) {
    response.status(400).json({ ok: false, error: 'Message is required' });
    return;
  }

  if (!GEMINI_API_KEY) {
    response.status(200).json({
      ok: true,
      fallback: true,
      provider: 'offline',
      answer: fallbackReply(body.message || body.mode, body.word),
    });
    return;
  }

  try {
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
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

    if (!result.ok) {
      response.status(result.status).json({ ok: false, provider: 'gemini', error: await result.text() });
      return;
    }

    const data = await result.json();
    response.status(200).json({
      ok: true,
      provider: 'gemini',
      model: GEMINI_MODEL,
      answer: readGeminiText(data) || 'Javob tayyor, lekin matn bosh qaytdi.',
    });
  } catch (error) {
    response.status(500).json({
      ok: false,
      provider: 'gemini',
      error: error instanceof Error ? error.message : 'Gemini tutor failed',
    });
  }
}
