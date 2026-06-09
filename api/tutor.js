const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const MODE_INSTRUCTIONS = {
  chat: 'Answer the learner question and keep the conversation going.',
  explain: 'Explain the selected word or selected list in a simple way.',
  examples: 'Generate simple Russian example sentences and Uzbek Latin translations.',
  quiz: 'Create one quiz question from context_words. Wait for the learner answer.',
  mistakes: 'Analyze recent mistakes and give a short repair drill.',
  dailyCoach: 'Create a daily 5-10 minute plan based on stats, mistakes, and review words.',
  lessonFeedback: 'Give feedback about lesson performance and what to do next.',
  grammarHelp: 'Explain the needed Russian grammar point very simply.',
  adaptivePlan: 'Recommend the next exercise types and weak categories.',
  speakingPractice:
    'Ask or evaluate a Russian speaking answer. Give grammar, vocabulary, fluency, relevance feedback and a next Russian question.',
  listeningPractice:
    'Create a Russian listening drill. Give one short Russian word or sentence for TTS, then check the learner translation or answer.',
  ieltsSpeaking:
    'Act like an IELTS Speaking examiner for Russian practice. Use Part 1, Part 2, or Part 3 style questions and score the answer.',
  rolePlay:
    'Run a Russian role-play conversation. Use everyday situations and keep the conversation moving after correcting mistakes.',
  audioConversation:
    'Have a short voice-friendly Russian conversation. Keep turns brief and ask one next question.',
  strictMotivator:
    'Analyze progress and give three concrete tasks with strict but respectful motivation.',
};

const TONE_INSTRUCTIONS = {
  kind: 'Be soft, patient, and encouraging.',
  normal: 'Be clear, direct, and teacher-like.',
  strict:
    'Be strict and motivating, but never insult the learner, never use profanity, and never attack identity or personal traits.',
  funnyStrict:
    'Be funny-strict and energetic. Use light playful pressure, but never insult the learner, never use profanity, and never attack identity or personal traits.',
};

function fallbackReply(message, word) {
  const activeWord = word?.russian ? `${word.russian} - ${word.uzbek}` : 'tanlangan soz';
  return [
    'Men hozir offline tutor rejimidaman. GEMINI_API_KEY qoyilgach toliq AI javob beraman.',
    `Hozirgi fokus: ${activeWord}.`,
    `Savolingiz: ${message}`,
    'Mashq: ruscha sozni 3 marta ovoz chiqarib ayting, keyin tarjimasini yozib koring.',
  ].join('\n\n');
}

function feedbackJsonInstruction() {
  return {
    required_format:
      'Return ONLY valid JSON. No markdown, no prose outside JSON. Use this exact shape.',
    schema: {
      type: 'speakingFeedback',
      score: 72,
      ieltsBand: 5.5,
      fluency: 65,
      grammar: 70,
      vocabulary: 75,
      pronunciationEstimate: 60,
      relevance: 80,
      mistakes: [
        {
          original: 'Я идти магазин',
          corrected: 'Я иду в магазин',
          explanation_uz:
            "Rus tilida hozirgi zamonda 'идти' emas, 'иду' ishlatiladi. 'магазин' oldidan 'в' kerak.",
        },
      ],
      betterAnswer_ru: 'Я иду в магазин, чтобы купить продукты.',
      betterAnswer_uz: "Men mahsulot sotib olish uchun do'konga ketyapman.",
      nextQuestion_ru: 'Что ты обычно покупаешь в магазине?',
      motivation_uz: "Yomon emas, lekin fe'lni noto'g'ri ishlatding. Bugun 'иду' seni tinch qo'ymaydi.",
    },
    pronunciation_note:
      'Pronunciation estimate is approximate because browser speech-to-text does not provide real pronunciation scoring.',
  };
}

function buildTutorText(body) {
  const word = body.word;
  const stats = body.stats || {};
  const recentMistakes = body.recentMistakes || [];
  const contextWords = body.contextWords || [];
  const history = body.history || [];

  return JSON.stringify(
    {
      role: 'Ruscha Tez AI Tutor',
      instruction:
        "You are the AI Coach of the Ruscha Tez app. Teach Russian to Uzbek speakers in Uzbek Latin. Be active, lively, short, and clear. Always ask questions, find mistakes, correct them, and give the next drill. Write Russian words and sentences in real Russian Cyrillic. Never insult, shame, use profanity, discriminate, threaten, or attack the learner's identity. If tone is strict or funnyStrict, be tougher as a motivational coach while staying respectful.",
      mode: body.mode || 'chat',
      mode_instruction: MODE_INSTRUCTIONS[body.mode] || MODE_INSTRUCTIONS.chat,
      tone: body.tone || 'normal',
      tone_instruction: TONE_INSTRUCTIONS[body.tone] || TONE_INSTRUCTIONS.normal,
      answer_length: body.answerLength || 'normal',
      wants_json: Boolean(body.wantsJson),
      user_message: body.message,
      extra_context: body.context || null,
      conversation_history: history.slice(-10).map((item) => ({
        role: item.role,
        text: item.text,
      })),
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
      json_response_rules:
        body.wantsJson || body.mode === 'speakingPractice' || body.mode === 'ieltsSpeaking'
          ? feedbackJsonInstruction()
          : null,
      answer_format:
        body.wantsJson || body.mode === 'speakingPractice' || body.mode === 'ieltsSpeaking'
          ? 'Return only valid JSON matching json_response_rules.schema.'
          : 'If this is a quiz answer: verdict, correction if needed, next question. Otherwise: 1 short explanation, 2 simple examples if useful, 1 quick question.',
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
