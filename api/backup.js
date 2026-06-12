const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const API_KEY = process.env.FIREBASE_API_KEY;
const COLLECTION = process.env.FIREBASE_BACKUP_COLLECTION || 'ruschaTezBackups';
const DOCUMENT = process.env.FIREBASE_BACKUP_DOCUMENT || 'default';

function compactPayload(payload) {
  return {
    exported_at: payload?.exported_at || new Date().toISOString(),
    progress: payload?.progress || [],
    settings: payload?.settings || null,
    events: (payload?.events || []).slice(-1000),
    tutorMessages: (payload?.tutorMessages || []).slice(-300),
    userProfile: payload?.userProfile || null,
    lessonProgress: payload?.lessonProgress || [],
    achievements: payload?.achievements || [],
    dailyActivity: payload?.dailyActivity || [],
    exerciseResults: (payload?.exerciseResults || []).slice(-2000),
    speakingAttempts: (payload?.speakingAttempts || []).slice(-500),
    grammarProgress: payload?.grammarProgress || [],
  };
}

function firestoreUrl() {
  return `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}/${DOCUMENT}?key=${API_KEY}`;
}

function missingConfig(response) {
  response.status(500).json({
    ok: false,
    error: 'Firebase env vars are missing',
    required: ['FIREBASE_PROJECT_ID', 'FIREBASE_API_KEY'],
  });
}

export default async function handler(request, response) {
  if (!PROJECT_ID || !API_KEY) {
    missingConfig(response);
    return;
  }

  if (request.method === 'GET') {
    const result = await fetch(firestoreUrl());
    if (result.status === 404) {
      response.status(404).json({ ok: false, error: 'Backup not found' });
      return;
    }
    if (!result.ok) {
      response.status(result.status).json({ ok: false, error: await result.text() });
      return;
    }

    const doc = await result.json();
    const raw = doc.fields?.payload?.stringValue;
    response.status(200).json(raw ? JSON.parse(raw) : {});
    return;
  }

  if (request.method === 'POST') {
    const payload = compactPayload(request.body || {});
    const result = await fetch(firestoreUrl(), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          payload: { stringValue: JSON.stringify(payload) },
          updatedAt: { timestampValue: new Date().toISOString() },
        },
      }),
    });

    if (!result.ok) {
      response.status(result.status).json({ ok: false, error: await result.text() });
      return;
    }

    response.status(200).json({ ok: true, saved_at: new Date().toISOString() });
    return;
  }

  response.setHeader('Allow', 'GET, POST');
  response.status(405).json({ ok: false, error: 'Method not allowed' });
}
