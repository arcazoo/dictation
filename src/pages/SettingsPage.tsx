import { GlassCard } from '../components/ui/GlassCard';
import { Icon, type IconName } from '../components/ui/icons';
import { Screen } from '../components/ui/Screen';
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
    <Screen className="max-w-2xl">
      <GlassCard className="!p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black">Profil va sozlamalar</h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">O'qish ritmi, AI, ko'rinish va sync</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            <Icon name="settings" size={22} />
          </span>
        </div>
      </GlassCard>

      <SettingsGroup icon="cards" title="O'qish" subtitle="Kunlik maqsad va takror ritmi">
        <p className="text-xs font-black uppercase tracking-wide text-slate-400">Kunlik vaqt</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[5, 10, 15, 25].map((minutes) => (
            <Pill key={minutes} active={settings.dailyReviewLimit === minutes * 4} onClick={() => patch({ dailyReviewLimit: minutes * 4 })}>
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
          label="Takror intensivligi"
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
      </SettingsGroup>

      <SettingsGroup icon="sparkles" title="AI Coach" subtitle="Uslub, javob uzunligi va speaking">
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
        <Toggle label="Audio javobni avtomatik o'qish" checked={settings.ai.autoSpeak} onChange={(value) => patch({ ai: { ...settings.ai, autoSpeak: value } })} />
        <Toggle label="Speaking baholash" checked={settings.ai.ieltsScoring} onChange={(value) => patch({ ai: { ...settings.ai, ieltsScoring: value } })} />
      </SettingsGroup>

      <SettingsGroup icon="star" title="Ko'rinish" subtitle="Tema va o'qish qulayligi">
        <Select
          label="Tema"
          value={settings.appearance.theme}
          values={[
            ['system', 'Sistema'],
            ['light', 'Yorug‘'],
            ['dark', 'Qorong‘i'],
          ]}
          onChange={(value) => patch({ appearance: { ...settings.appearance, theme: value as Settings['appearance']['theme'] } })}
        />
        <Select
          label="Shrift o'lchami"
          value={settings.appearance.fontSize}
          values={[
            ['small', 'Kichik'],
            ['medium', 'Normal'],
            ['large', 'Katta'],
          ]}
          onChange={(value) => patch({ appearance: { ...settings.appearance, fontSize: value as Settings['appearance']['fontSize'] } })}
        />
        <Toggle
          label="Ruscha talaffuz tugmalari"
          checked={settings.sound.pronunciation}
          onChange={(value) => patch({ sound: { ...settings.sound, pronunciation: value } })}
        />
      </SettingsGroup>

      <SettingsGroup icon="zap" title="Sinxronlash" subtitle="Progress avtomatik saqlanadi">
        <div className="rounded-2xl border-2 border-ink-900/[0.07] bg-ink-50 p-4 dark:border-white/[0.07] dark:bg-ink-900">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${syncDot(syncStatus)}`} />
            <p className="text-sm font-black">{syncLabel(syncStatus)}</p>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{syncHint(syncStatus)}</p>
          <p className="mt-2 text-[11px] font-bold text-slate-400">
            Oxirgi sync: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'hali yo‘q'}
          </p>
        </div>
      </SettingsGroup>

      <details className="rounded-2xl border-2 border-danger-500/25 bg-danger-100/40 p-4 dark:bg-rose-950/20">
        <summary className="cursor-pointer text-sm font-black text-danger-700 dark:text-rose-300">Xavfli hudud</summary>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <DangerButton onClick={async () => { await clearMistakes(); await reload(); }}>Xatolarni tozalash</DangerButton>
          <DangerButton onClick={async () => { await clearProgress(); await reload(); }}>Progressni tozalash</DangerButton>
          <DangerButton onClick={async () => { await resetSettings(); await reload(); }}>Sozlamalarni reset</DangerButton>
        </div>
      </details>
    </Screen>
  );
}

function SettingsGroup({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard>
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
          <Icon name={icon} size={20} />
        </span>
        <div>
          <h2 className="text-base font-black">{title}</h2>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </GlassCard>
  );
}

function syncDot(status: SyncStatus) {
  if (status === 'synced') return 'bg-success-500';
  if (status === 'syncing') return 'bg-warn-500 animate-pulse';
  if (status === 'error') return 'bg-danger-500';
  if (status === 'offline') return 'bg-slate-400';
  return 'bg-brand-500';
}

function syncLabel(status: SyncStatus) {
  if (status === 'syncing') return 'Progress saqlanmoqda...';
  if (status === 'synced') return 'Progress avtomatik saqlandi';
  if (status === 'offline') return 'Offline rejim';
  if (status === 'error') return 'Sync vaqtincha ishlamadi';
  return 'Progress avtomatik saqlanmoqda';
}

function syncHint(status: SyncStatus) {
  if (status === 'offline') return "Internet qaytganda avtomatik serverga yuboriladi.";
  if (status === 'error') return 'Mahalliy progress saqlangan. Keyingi urinishda sync davom etadi.';
  return 'IndexedDB va server backup avtomatik ishlaydi.';
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-xl border-2 px-2 text-sm font-black transition active:scale-95 ${
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-ink-900/10 bg-white text-slate-500 dark:border-white/10 dark:bg-ink-900 dark:text-slate-400'
      }`}
    >
      {children}
    </button>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="mt-4 block text-xs font-black uppercase tracking-wide text-slate-400">
      {label}
      <input
        type="number"
        min="5"
        step="5"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 min-h-12 w-full rounded-xl border-2 border-ink-900/10 bg-white px-3 text-base font-black text-ink-900 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-ink-900 dark:text-white"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="mt-3 flex min-h-12 w-full items-center justify-between rounded-xl border-2 border-ink-900/10 bg-white px-3 text-left text-sm font-black dark:border-white/10 dark:bg-ink-900"
    >
      {label}
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full border-2 transition ${
          checked ? 'border-brand-700 bg-brand-600' : 'border-ink-900/15 bg-ink-100 dark:border-white/15 dark:bg-ink-700'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`}
        />
      </span>
    </button>
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
    <label className="mt-4 block text-xs font-black uppercase tracking-wide text-slate-400">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-xl border-2 border-ink-900/10 bg-white px-3 text-base font-black text-ink-900 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-ink-900 dark:text-white"
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
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 rounded-xl border-2 border-b-4 border-danger-600/40 bg-white px-3 text-sm font-black text-danger-700 transition active:translate-y-[2px] active:border-b-2 dark:bg-ink-900 dark:text-rose-300"
    >
      {children}
    </button>
  );
}
