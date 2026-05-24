import { useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import type { ImportPayload } from '../db/indexedDb';
import { loadBackupFromServer, saveBackupToServer } from '../lib/serverSync';
import type { Settings } from '../types';

export function SettingsPage({
  settings,
  updateSettings,
  exportData,
  importData,
  clearProgress,
  clearMistakes,
  resetSettings,
  reload,
}: {
  settings: Settings;
  updateSettings: (settings: Settings) => Promise<void>;
  exportData: () => Promise<unknown>;
  importData: (payload: ImportPayload) => Promise<void>;
  clearProgress: () => Promise<void>;
  clearMistakes: () => Promise<void>;
  resetSettings: () => Promise<Settings>;
  reload: () => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [serverStatus, setServerStatus] = useState('');

  const patch = (next: Partial<Settings>) => updateSettings({ ...settings, ...next });

  async function downloadExport() {
    const payload = await exportData();
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `ruscha-tez-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importFile(file?: File) {
    if (!file) return;
    const payload = JSON.parse(await file.text());
    await importData(payload);
    await reload();
  }

  async function backupToServer() {
    try {
      setServerStatus('Serverga yuborilmoqda...');
      const payload = await exportData();
      const result = await saveBackupToServer(payload);
      setServerStatus(result.ok ? `Backup saqlandi: ${new Date(result.saved_at).toLocaleString()}` : 'Backup saqlanmadi');
    } catch {
      setServerStatus('Server topilmadi. Avval npm run server ishga tushiring.');
    }
  }

  async function restoreFromServer() {
    try {
      setServerStatus('Serverdan olinmoqda...');
      const payload = await loadBackupFromServer();
      await importData(payload);
      await reload();
      setServerStatus('Server backup yuklandi');
    } catch {
      setServerStatus('Server backup topilmadi.');
    }
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Kunlik reja, test, takrorlash, ovoz va progress boshqaruvi." />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-black">Kunlik reja</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <PlanButton label="Yengil" onClick={() => patch({ dailyPlan: { nounsPages: 0.5, adjectivesPages: 0.5, verbsPages: 0.5 } })} />
            <PlanButton label="Standart" onClick={() => patch({ dailyPlan: { nounsPages: 1, adjectivesPages: 1, verbsPages: 1 } })} />
            <PlanButton label="Kuchli" onClick={() => patch({ dailyPlan: { nounsPages: 2, adjectivesPages: 2, verbsPages: 2 } })} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <NumberField label="Otlar" value={settings.dailyPlan.nounsPages} onChange={(value) => patch({ dailyPlan: { ...settings.dailyPlan, nounsPages: value } })} />
            <NumberField label="Sifatlar" value={settings.dailyPlan.adjectivesPages} onChange={(value) => patch({ dailyPlan: { ...settings.dailyPlan, adjectivesPages: value } })} />
            <NumberField label="Fe'llar" value={settings.dailyPlan.verbsPages} onChange={(value) => patch({ dailyPlan: { ...settings.dailyPlan, verbsPages: value } })} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-black">Test sozlamalari</h2>
          <Toggle label="Flashcard" checked={settings.testTypes.flashcard} onChange={(value) => patch({ testTypes: { ...settings.testTypes, flashcard: value } })} />
          <Toggle label="4 variantli test" checked={settings.testTypes.multipleChoice} onChange={(value) => patch({ testTypes: { ...settings.testTypes, multipleChoice: value } })} />
          <Toggle label="Yozma javob" checked={settings.testTypes.writtenAnswer} onChange={(value) => patch({ testTypes: { ...settings.testTypes, writtenAnswer: value } })} />
          <Toggle label="O'zbekcha → Ruscha" checked={settings.testTypes.reverseTranslation} onChange={(value) => patch({ testTypes: { ...settings.testTypes, reverseTranslation: value } })} />
          <Toggle label="Faqat xato so'zlar" checked={settings.testTypes.onlyMistakes} onChange={(value) => patch({ testTypes: { ...settings.testTypes, onlyMistakes: value } })} />
        </Card>

        <Card>
          <h2 className="text-lg font-black">Takrorlash</h2>
          <NumberField label="Eski so'z limiti" value={settings.dailyReviewLimit} onChange={(value) => patch({ dailyReviewLimit: value })} />
          <label className="mt-4 block text-sm font-bold">Dars tartibi</label>
          <select
            value={settings.lessonOrder}
            onChange={(event) => patch({ lessonOrder: event.target.value as Settings['lessonOrder'] })}
            className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="mixed">Aralash</option>
            <option value="category">Kategoriya bo'yicha</option>
          </select>
        </Card>

        <Card>
          <h2 className="text-lg font-black">Til va tarjima</h2>
          <Select label="Til" value={settings.language} values={['uz_latin', 'uz_cyrillic', 'ru']} onChange={(value) => patch({ language: value as Settings['language'] })} />
          <Select label="Tarjima ko'rinishi" value={settings.translationScript} values={['latin', 'cyrillic', 'both']} onChange={(value) => patch({ translationScript: value as Settings['translationScript'] })} />
        </Card>

        <Card>
          <h2 className="text-lg font-black">Bildirishnoma</h2>
          <Toggle label="Ichki reminder panel" checked={settings.notifications.enabled} onChange={(value) => patch({ notifications: { ...settings.notifications, enabled: value } })} />
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <TimeField label="09:00 dars" value={settings.notifications.morning} onChange={(value) => patch({ notifications: { ...settings.notifications, morning: value } })} />
            <TimeField label="14:00 test" value={settings.notifications.afternoon} onChange={(value) => patch({ notifications: { ...settings.notifications, afternoon: value } })} />
            <TimeField label="21:00 xato" value={settings.notifications.evening} onChange={(value) => patch({ notifications: { ...settings.notifications, evening: value } })} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-black">Ovoz</h2>
          <Toggle label="Ruscha talaffuz" checked={settings.sound.pronunciation} onChange={(value) => patch({ sound: { ...settings.sound, pronunciation: value } })} />
          <Toggle label="Avtomatik talaffuz" checked={settings.sound.autoPlay} onChange={(value) => patch({ sound: { ...settings.sound, autoPlay: value } })} />
          <Select label="Ovoz tezligi" value={settings.sound.speed} values={['slow', 'normal', 'fast']} onChange={(value) => patch({ sound: { ...settings.sound, speed: value as Settings['sound']['speed'] } })} />
        </Card>

        <Card>
          <h2 className="text-lg font-black">Dizayn</h2>
          <Select label="Theme" value={settings.appearance.theme} values={['light', 'dark', 'system']} onChange={(value) => patch({ appearance: { ...settings.appearance, theme: value as Settings['appearance']['theme'] } })} />
          <Select label="Shrift o'lchami" value={settings.appearance.fontSize} values={['small', 'medium', 'large']} onChange={(value) => patch({ appearance: { ...settings.appearance, fontSize: value as Settings['appearance']['fontSize'] } })} />
        </Card>

        <Card>
          <h2 className="text-lg font-black">Progress boshqaruvi</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button onClick={downloadExport}>JSON eksport</Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>JSON import</Button>
            <Button variant="secondary" onClick={backupToServer}>Server backup</Button>
            <Button variant="secondary" onClick={restoreFromServer}>Serverdan yuklash</Button>
            <Button variant="secondary" onClick={async () => { await clearMistakes(); await reload(); }}>Xatolarni tozalash</Button>
            <Button variant="danger" onClick={async () => { await clearProgress(); await reload(); }}>Progressni tozalash</Button>
            <Button variant="ghost" onClick={async () => { await resetSettings(); await reload(); }}>Settings reset</Button>
          </div>
          {serverStatus ? <p className="mt-3 text-sm font-bold text-brand-600">{serverStatus}</p> : null}
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(event) => importFile(event.target.files?.[0])} />
        </Card>
      </section>
    </>
  );
}

function PlanButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <Button variant="secondary" onClick={onClick} className="px-2">{label}</Button>;
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        type="number"
        min="0"
        step="0.5"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
      />
    </label>
  );
}

function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        type="time"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="mt-3 flex min-h-12 items-center justify-between rounded-lg border border-slate-200 px-3 text-sm font-bold dark:border-slate-800">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-brand-600" />
    </label>
  );
}

function Select({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-3 block text-sm font-bold">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
      >
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
