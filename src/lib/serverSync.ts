import type { ImportPayload } from '../db/indexedDb';
import type { SyncStatus } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export async function saveBackupToServer(payload: unknown) {
  const response = await fetch(`${API_BASE}/api/backup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Server backup failed');
  return response.json() as Promise<{ ok: boolean; saved_at: string }>;
}

export async function loadBackupFromServer() {
  const response = await fetch(`${API_BASE}/api/backup`);
  if (!response.ok) throw new Error('Server backup not found');
  return response.json() as Promise<ImportPayload>;
}

export function getNetworkSyncStatus(): SyncStatus {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'offline';
  return 'idle';
}
