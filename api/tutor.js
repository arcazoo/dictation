const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.2';

function fallbackReply(message, word) {
  const activeWord = word?.russian ? `${word.russian} - ${word.uzbek}` : 'tanlangan so‘z';
  return [
    `Men hozir offline tutor rejimidaman. OpenAI kaliti qo‘yilgach to‘liq AI javob beraman.`,
    `Hozirgi fokus: ${activeWord}.`,
    `Savolingiz: ${message}`,
    `Mashq: ruscha so‘zni 3 marta ovoz chiqarib ayting, keyin tarjimasini yozib ko‘ring.`,
  ].join('\n\n');
}

function buildPrompt(body) {
  const word = body.word;
  const stats = body.stats || {};
  const recentMistakes = body.recentMistakes || [];
  const mode = body.mode || 'chat';

  return [
    {
      role: 'developer',
      content:
        'You are Ruscha Tez AI Tutor. Teach Russian vocabulary to Uzbek speakers. Reply in Uzbek Latin by default. Be short, practical, mobile-friendly, and quiz the learner. Use simple Russian examples with Uzbek translations. Do not invent progress data.',
    },
    {
      role: 'user',
      content: JSON.stringify(
        {
          mode,
          user_message: body.message,
          active_word: word
            ? {
                russian: word.russian,
                uzbek: word.uzbek,
                category: word.category_ru,
                page: word.page,
              }
            : null,
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
          answer_format:
            'Return helpful tutoring text. If useful, include: 1 short explanation, 2 example sentences, 1 quick question for the learner.',
        },
        null,
        2,
      ),
    },
  ];
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

  if (!OPENAI_API_KEY) {
    response.status(200).json({
      ok: true,
      fallback: true,
      answer: fallbackReply(body.message || body.mode, body.word),
    });
    return;
  }

  try {
    const result = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: buildPrompt(body),
      }),
    });

    if (!result.ok) {
      response.status(result.status).json({ ok: false, error: await result.text() });
      return;
    }

    const data = await result.json();
    response.status(200).json({
      ok: true,
      answer: data.output_text || 'Javob tayyor, lekin matn bo‘sh qaytdi.',
    });
  } catch (error) {
    response.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'AI tutor failed',
    });
  }
}
