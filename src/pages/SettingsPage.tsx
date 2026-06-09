import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
import { Screen } from '../components/ui/Screen';
import { SectionHeader } from '../components/ui/SectionHeader';
import type { ImportPayload } from '../db/indexedDb';
import type { Settings, SyncStatus } from '../types';

export function SettingsPage({
  settings,
  updateSettings,
  clearProgress,
  clearMistakes,
  resetSettings,
  reload,
  syncStatus,
  lastSyncedAt,
}: {
  settings: Settings;
  updateSettings: (settings: Settings) => Promise<void>;
  exportData: () => Promise<unknown>;
  importData: (payload: ImportPayload) => Promise<void>;
  clearProgress: () => Promise<void>;
  clearMistakes: () => Promise<void>;
  resetSettings: () => Promise<Settings>;
  reload: () => Promise<void>;
  syncStatus: SyncStatus;
  lastSyncedAt: string;
}) {
  const patch = (next: Partial<Settings>) => updateSettings({ ...settings, ...next });

  return (
    <Screen className="max-w-5xl">
      <GradientCard variant="dark">
        <p className="text-sm font-black uppercase opacity-80">Settings</p>
        <h1 className="mt-2 text-3xl font-black sm:text-5xl">Sozlamalar</h1>
        <p className="mt-2 max-w-2xl text-sm font-bold opacity-80">
          Faqat kundalik o'qish, AI Coach, ko'rinish va avtomatik sync holati.
        </p>
      </GradientCard>

      <section className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <SectionHeader title="O'qish" subtitle="Kunlik maqsad va review ritmi." />
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[5, 10, 15, 25].map((minutes) => (
              <Pill
                key={minutes}
                active={settings.ai ? settings.dailyReviewLimit === minutes * 4 : false}
                onClick={() => patch({ dailyReviewLimit: minutes * 4 })}
              >
                {minutes} min
              </Pill>
            ))}
          </div>
          <NumberField
            label="Kunlik yangi so'zlar"
            value={Math.round((settings.dailyPlan.nounsPages + settings.dailyPlan.adjectivesPages + settings.dailyPlan.verbsPages) * 20)}
            onChange={(value) => {
              const pages = Math.max(0.5, Math.min(2, value / 60));
              patch({ dailyPlan: { nounsPages: pages, adjectivesPages: pages, verbsPages: pages } });
            }}
          />
          <Select
            label="Review intensivligi"
            value={settings.reviewMode}
            values={[
              ['easy', 'Past'],
              ['normal', 'Normal'],
              ['hard', 'Kuchli'],
            ]}
            onChange={(value) => patch({ reviewMode: value as Settings['reviewMode'] })}
          />
          <Toggle
            label="Faqat xato so'zlar testi"
            checked={settings.testTypes.onlyMistakes}
            onChange={(value) => patch({ testTypes: { ...settings.testTypes, onlyMistakes: value } })}
          />
        </GlassCard>

        <GlassCard>
          <SectionHeader title="AI Coach" subtitle="Uslub, javob uzunligi va speaking." />
          <Select
            label="AI uslubi"
            value={settings.ai.coachTone}
            values={[
              ['kind', 'Yumshoq'],
              ['normal', 'Oddiy'],
              ['strict', 'Qattiq'],
              ['funnyStrict', 'Hazilkash qattiq'],
            ]}
            onChange={(value) => patch({ ai: { ...settings.ai, coachTone: value as Settings['ai']['coachTone'] } })}
          />
          <Select
            label="Javob uzunligi"
            value={settings.ai.answerLength}
            values={[
              ['short', 'Qisqa'],
              ['normal', 'Normal'],
              ['detailed', 'Batafsil'],
            ]}
            onChange={(value) => patch({ ai: { ...settings.ai, answerLength: value as Settings['ai']['answerLength'] } })}
          />
          <Toggle
            label="Audio javobni avtomatik o'qish"
            checked={settings.ai.autoSpeak}
            onChange={(value) => patch({ ai: { ...settings.ai, autoSpeak: value } })}
          />
          <Toggle
            label="Speaking baholash"
            checked={settings.ai.ieltsScoring}
            onChange={(value) => patch({ ai: { ...settings.ai, ieltsScoring: value } })}
          />
        </GlassCard>

        <GlassCard>
          <SectionHeader title="Ko'rinish" subtitle="Theme va o'qish qulayligi." />
          <Select
            label="Theme"
            value={settings.appearance.theme}
            values={[
              ['system', 'System'],
              ['light', 'Light'],
              ['dark', 'Dark'],
            ]}
            onChange={(value) => patch({ appearance: { ...settings.appearance, theme: value as Settings['appearance']['theme'] } })}
          />
          <Select
            label="Font size"
            value={settings.appearance.fontSize}
            values={[
              ['small', 'Small'],
              ['medium', 'Normal'],
              ['large', 'Large'],
            ]}
            onChange={(value) => patch({ appearance: { ...settings.appearance, fontSize: value as Settings['appearance']['fontSize'] } })}
          />
          <Toggle
            label="Ruscha talaffuz tugmalari"
            checked={settings.sound.pronunciation}
            onChange={(value) => patch({ sound: { ...settings.sound, pronunciation: value } })}
          />
        </GlassCard>

        <GlassCard>
          <SectionHeader title="Hisob va sinxronlash" subtitle="Progress avtomatik saqlanadi." />
          <div className="mt-4 rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-sm font-black">{syncLabel(syncStatus)}</p>
            <p className="mt-1 text-sm text-slate-500">{syncHint(syncStatus)}</p>
            <p className="mt-3 text-xs font-bold text-slate-400">
              Oxirgi sync: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'hali yoq'}
            </p>
          </div>
          <div className="mt-4 rounded-3xl bg-brand-50 p-4 text-sm font-bold text-brand-800 dark:bg-brand-950/50 dark:text-brand-100">
            Progress avtomatik saqlanadi. Internet bo'lmasa telefonda turadi, internet qaytganda serverga yuboriladi.
          </div>
        </GlassCard>
      </section>

      <details className="rounded-3xl border border-rose-100 bg-rose-50/70 p-4 dark:border-rose-950 dark:bg-rose-950/20">
        <summary className="cursor-pointer text-sm font-black text-rose-700 dark:text-rose-100">Danger zone</summary>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <DangerButton onClick={async () => { await clearMistakes(); await reload(); }}>Xatolarni tozalash</DangerButton>
          <DangerButton onClick={async () => { await clearProgress(); await reload(); }}>Progressni tozalash</DangerButton>
          <DangerButton onClick={async () => { await resetSettings(); await reload(); }}>Settings reset</DangerButton>
        </div>
      </details>
    </Screen>
  );
}

function syncLabel(status: SyncStatus) {
  if (status === 'syncing') return 'Progress saqlanmoqda...';
  if (status === 'synced') return 'Progress avtomatik saqlandi';
  if (status === 'offline') return 'Offline rejim';
  if (status === 'error') return 'Sync vaqtincha ishlamadi';
  return 'Progress avtomatik saqlanmoqda';
}

function syncHint(status: SyncStatus) {
  if (status === 'offline') return 'Internet qaytganda avtomatik serverga yuboriladi.';
  if (status === 'error') return 'Mahalliy progress saqlangan. Keyingi urinishda sync davom etadi.';
  return 'IndexedDB va server backup avtomatik ishlaydi.';
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-2xl px-3 text-sm font-black transition ${
        active ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      {children}
    </button>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="mt-4 block text-sm font-black">
      {label}
      <input
        type="number"
        min="5"
        step="5"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-3 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="mt-3 flex min-h-12 items-center justify-between rounded-2xl border border-slate-200 bg-white/60 px-3 text-sm font-black dark:border-slate-800 dark:bg-slate-950/60">
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
  values: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-4 block text-sm font-black">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-3 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
      >
        {values.map(([item, labelText]) => (
          <option key={item} value={item}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

function DangerButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="min-h-11 rounded-2xl bg-white px-3 text-sm font-black text-rose-700 shadow-soft dark:bg-slate-950 dark:text-rose-100">
      {children}
    </button>
  );
}
