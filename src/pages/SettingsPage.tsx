import { useRef, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Icon, type IconName } from '../components/ui/icons';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { Screen } from '../components/ui/Screen';
import type { ImportPayload } from '../db/indexedDb';
import type { Settings, SyncStatus, UserProfile } from '../types';

export function SettingsPage({
  settings,
  updateSettings,
  profile,
  updateProfile,
  exportData,
  importData,
  clearProgress,
  clearMistakes,
  resetSettings,
  reload,
  syncStatus,
  lastSyncedAt,
  syncNow,
}: {
  settings: Settings;
  updateSettings: (settings: Settings) => Promise<void>;
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => Promise<void>;
  exportData: () => Promise<unknown>;
  importData: (payload: ImportPayload) => Promise<void>;
  clearProgress: () => Promise<void>;
  clearMistakes: () => Promise<void>;
  resetSettings: () => Promise<Settings>;
  reload: () => Promise<void>;
  syncStatus: SyncStatus;
  lastSyncedAt: string;
  syncNow: () => void;
}) {
  const patch = (next: Partial<Settings>) => updateSettings({ ...settings, ...next });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState('');
  const [confirmAction, setConfirmAction] = useState<null | { label: string; run: () => Promise<void> }>(null);

  const dailyNewWords = Math.round(
    (settings.dailyPlan.nounsPages + settings.dailyPlan.adjectivesPages + settings.dailyPlan.verbsPages) * 20,
  );

  async function handleExport() {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ruscha-tez-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(file: File) {
    try {
      setImportStatus('Yuklanmoqda...');
      const payload = JSON.parse(await file.text()) as ImportPayload;
      await importData(payload);
      setImportStatus('Import muvaffaqiyatli! Qayta yuklanmoqda...');
      await reload();
      setImportStatus('');
    } catch {
      setImportStatus("Xato: fayl noto'g'ri formatda.");
    }
  }

  return (
    <Screen className="max-w-2xl">
      <GlassCard className="!p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black">Profil va sozlamalar</h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Hammasini o'zingizga moslang</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            <Icon name="settings" size={22} />
          </span>
        </div>
      </GlassCard>

      {/* ============ PROFIL ============ */}
      <Group icon="user" title="Profil" subtitle="Ism va kunlik maqsad">
        <Label>Ismingiz</Label>
        <input
          defaultValue={profile.name}
          onBlur={(event) => {
            const name = event.target.value.trim();
            if (name && name !== profile.name) void updateProfile({ ...profile, name });
          }}
          className="mt-2 min-h-12 w-full rounded-xl border-2 border-ink-900/10 bg-white px-3 text-base font-black outline-none focus:border-brand-500 dark:border-white/10 dark:bg-ink-900"
          placeholder="Ismingizni yozing"
        />
        <Label className="mt-4">Kunlik XP maqsadi</Label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[30, 60, 100, 150].map((xp) => (
            <Pill key={xp} active={profile.daily_goal_xp === xp} onClick={() => void updateProfile({ ...profile, daily_goal_xp: xp })}>
              {xp} XP
            </Pill>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <MiniStat label="Streak" value={`${profile.streak} kun`} />
          <MiniStat label="Jami XP" value={profile.total_xp} />
          <MiniStat label="Level" value={profile.level} />
        </div>
      </Group>

      {/* ============ O'QISH REJIMI ============ */}
      <Group icon="cards" title="O'qish rejimi" subtitle="Yangi so'zlar, takror va qiyinlik">
        <Label>Kunlik vaqt (takror hajmi)</Label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[5, 10, 15, 25].map((minutes) => (
            <Pill key={minutes} active={settings.dailyReviewLimit === minutes * 4} onClick={() => patch({ dailyReviewLimit: minutes * 4 })}>
              {minutes} min
            </Pill>
          ))}
        </div>

        <Label className="mt-4">Kunlik yangi so'zlar: {dailyNewWords} ta</Label>
        <input
          type="range"
          min={10}
          max={120}
          step={10}
          value={dailyNewWords}
          onChange={(event) => {
            const pages = Math.max(0.15, Number(event.target.value) / 60);
            patch({ dailyPlan: { nounsPages: pages, adjectivesPages: pages, verbsPages: pages } });
          }}
          className="mt-2 w-full accent-brand-600"
        />

        <Select
          label="Takror intensivligi"
          value={settings.reviewMode}
          values={[
            ['easy', 'Past — kam takror'],
            ['normal', 'Normal'],
            ['hard', "Kuchli — ko'p takror"],
          ]}
          onChange={(value) => patch({ reviewMode: value as Settings['reviewMode'] })}
        />
        <Select
          label="Dars tartibi"
          value={settings.lessonOrder}
          values={[
            ['mixed', 'Aralash (ot + sifat + fe’l birga)'],
            ['category', "Kategoriya bo'yicha"],
          ]}
          onChange={(value) => patch({ lessonOrder: value as Settings['lessonOrder'] })}
        />
        <Select
          label="Qiyinlik darajasi"
          value={settings.difficulty}
          values={[
            ['beginner', "Boshlang'ich"],
            ['normal', 'Normal'],
            ['hard', 'Qiyin — uzunroq darslar'],
          ]}
          onChange={(value) => patch({ difficulty: value as Settings['difficulty'] })}
        />
      </Group>

      {/* ============ TEST TURLARI ============ */}
      <Group icon="clipboard" title="Mashq turlari" subtitle="Qaysi mashqlar ishlatilsin">
        <Toggle label="Flashcard" checked={settings.testTypes.flashcard} onChange={(value) => patch({ testTypes: { ...settings.testTypes, flashcard: value } })} />
        <Toggle label="4 variantli test" checked={settings.testTypes.multipleChoice} onChange={(value) => patch({ testTypes: { ...settings.testTypes, multipleChoice: value } })} />
        <Toggle label="Yozma javob" checked={settings.testTypes.writtenAnswer} onChange={(value) => patch({ testTypes: { ...settings.testTypes, writtenAnswer: value } })} />
        <Toggle label="Teskari tarjima (uz → ru)" checked={settings.testTypes.reverseTranslation} onChange={(value) => patch({ testTypes: { ...settings.testTypes, reverseTranslation: value } })} />
        <Toggle label="Faqat xato so'zlar testi" checked={settings.testTypes.onlyMistakes} onChange={(value) => patch({ testTypes: { ...settings.testTypes, onlyMistakes: value } })} />
      </Group>

      {/* ============ TIL VA YOZUV ============ */}
      <Group icon="book" title="Til va yozuv" subtitle="Tarjimalar qaysi alifboda ko'rinsin">
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ['latin', 'Lotin', 'yangi'],
              ['cyrillic', 'Kirill', 'янги'],
              ['both', 'Ikkalasi', 'yangi · янги'],
            ] as const
          ).map(([id, label, sample]) => (
            <button
              key={id}
              type="button"
              onClick={() => patch({ translationScript: id })}
              className={`rounded-xl border-2 border-b-4 p-3 text-center transition active:translate-y-[2px] active:border-b-2 ${
                settings.translationScript === id
                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/40'
                  : 'border-ink-900/10 bg-white dark:border-white/10 dark:bg-ink-900'
              }`}
            >
              <span className="block text-sm font-black">{label}</span>
              <span className="mt-1 block text-xs font-bold text-slate-400">{sample}</span>
            </button>
          ))}
        </div>
      </Group>

      {/* ============ OVOZ ============ */}
      <Group icon="volume" title="Ovoz" subtitle="Talaffuz va effektlar">
        <Toggle label="Ruscha talaffuz tugmalari" checked={settings.sound.pronunciation} onChange={(value) => patch({ sound: { ...settings.sound, pronunciation: value } })} />
        <Toggle label="So'zni avtomatik o'qish" checked={settings.sound.autoPlay} onChange={(value) => patch({ sound: { ...settings.sound, autoPlay: value } })} />
        <Toggle label="Feedback ovozlari (ding/buzz)" checked={settings.sound.effects !== false} onChange={(value) => patch({ sound: { ...settings.sound, effects: value } })} />
        <Select
          label="Talaffuz tezligi"
          value={settings.sound.speed}
          values={[
            ['slow', 'Sekin'],
            ['normal', 'Normal'],
            ['fast', 'Tez'],
          ]}
          onChange={(value) => patch({ sound: { ...settings.sound, speed: value as Settings['sound']['speed'] } })}
        />
      </Group>

      {/* ============ AI COACH ============ */}
      <Group icon="sparkles" title="AI Coach" subtitle="Suhbatdosh xarakteri">
        <Select
          label="AI uslubi"
          value={settings.ai.coachTone}
          values={[
            ['kind', 'Yumshoq va sabrli'],
            ['normal', 'Oddiy o‘qituvchi'],
            ['strict', 'Qattiqqo‘l motivator'],
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
        <Toggle label="Suhbat oxirida baholash (band/score)" checked={settings.ai.ieltsScoring} onChange={(value) => patch({ ai: { ...settings.ai, ieltsScoring: value } })} />
        <Toggle label="Har bir xatoni qattiq tuzatish" checked={settings.ai.strictCorrection} onChange={(value) => patch({ ai: { ...settings.ai, strictCorrection: value } })} />
      </Group>

      {/* ============ KO'RINISH ============ */}
      <Group icon="star" title="Ko'rinish" subtitle="Tema va shrift">
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ['light', "Yorug'"],
              ['dark', "Qorong'i"],
              ['system', 'Sistema'],
            ] as const
          ).map(([id, label]) => (
            <Pill key={id} active={settings.appearance.theme === id} onClick={() => patch({ appearance: { ...settings.appearance, theme: id } })}>
              {label}
            </Pill>
          ))}
        </div>
        <Label className="mt-4">Shrift o'lchami</Label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(
            [
              ['small', 'Kichik'],
              ['medium', 'Normal'],
              ['large', 'Katta'],
            ] as const
          ).map(([id, label]) => (
            <Pill key={id} active={settings.appearance.fontSize === id} onClick={() => patch({ appearance: { ...settings.appearance, fontSize: id } })}>
              {label}
            </Pill>
          ))}
        </div>
      </Group>

      {/* ============ MA'LUMOTLAR ============ */}
      <Group icon="zap" title="Ma'lumotlar va sync" subtitle="Backup, export, import">
        <div className="rounded-2xl border-2 border-ink-900/[0.07] bg-ink-50 p-4 dark:border-white/[0.07] dark:bg-ink-900">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${syncDot(syncStatus)}`} />
            <p className="text-sm font-black">{syncLabel(syncStatus)}</p>
          </div>
          <p className="mt-1 text-[11px] font-bold text-slate-400">
            Oxirgi sync: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : "hali yo'q"}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <SecondaryActionButton onClick={syncNow}>Hozir saqlash</SecondaryActionButton>
          <SecondaryActionButton onClick={() => void reload()}>Serverdan olish</SecondaryActionButton>
          <SecondaryActionButton onClick={() => void handleExport()}>JSON export</SecondaryActionButton>
          <SecondaryActionButton onClick={() => fileInputRef.current?.click()}>JSON import</SecondaryActionButton>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleImportFile(file);
            event.target.value = '';
          }}
        />
        {importStatus ? <p className="mt-2 text-sm font-black text-brand-600">{importStatus}</p> : null}
      </Group>

      {/* ============ XAVFLI HUDUD ============ */}
      <details className="rounded-2xl border-2 border-danger-500/25 bg-danger-100/40 p-4 dark:bg-rose-950/20">
        <summary className="cursor-pointer text-sm font-black text-danger-700 dark:text-rose-300">Xavfli hudud</summary>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <DangerButton onClick={() => setConfirmAction({ label: "Barcha xato belgilarini tozalash", run: async () => { await clearMistakes(); await reload(); } })}>
            Xatolarni tozalash
          </DangerButton>
          <DangerButton onClick={() => setConfirmAction({ label: "BUTUN progressni o'chirish (qaytarib bo'lmaydi!)", run: async () => { await clearProgress(); await reload(); } })}>
            Progressni o'chirish
          </DangerButton>
          <DangerButton onClick={() => setConfirmAction({ label: 'Sozlamalarni boshlang‘ich holatga qaytarish', run: async () => { await resetSettings(); await reload(); } })}>
            Sozlamalar reset
          </DangerButton>
        </div>
      </details>

      {/* Tasdiqlash oynasi */}
      {confirmAction ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink-950/55 p-4" onClick={() => setConfirmAction(null)}>
          <div className="w-full max-w-sm animate-pop-in rounded-2xl border-2 border-ink-900/10 bg-white p-5 dark:border-white/10 dark:bg-ink-800" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-lg font-black">Ishonchingiz komilmi?</h2>
            <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">{confirmAction.label}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <SecondaryActionButton onClick={() => setConfirmAction(null)}>Bekor qilish</SecondaryActionButton>
              <PrimaryActionButton
                className="!border-danger-800 !bg-danger-600"
                onClick={async () => {
                  await confirmAction.run();
                  setConfirmAction(null);
                }}
              >
                Ha, bajarish
              </PrimaryActionButton>
            </div>
          </div>
        </div>
      ) : null}
    </Screen>
  );
}

function Group({ icon, title, subtitle, children }: { icon: IconName; title: string; subtitle: string; children: React.ReactNode }) {
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

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`block text-xs font-black uppercase tracking-wide text-slate-400 ${className}`}>{children}</p>;
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border-2 border-ink-900/[0.07] bg-ink-50 p-2.5 dark:border-white/[0.07] dark:bg-ink-900">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-0.5 text-base font-black">{value}</p>
    </div>
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
  if (status === 'syncing') return 'Saqlanmoqda...';
  if (status === 'synced') return 'Avtomatik saqlandi';
  if (status === 'offline') return 'Offline — internet qaytganda saqlanadi';
  if (status === 'error') return 'Sync xatosi — mahalliy nusxa saqlangan';
  return 'Avtomatik saqlash yoniq';
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

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="mt-3 flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border-2 border-ink-900/10 bg-white px-3 text-left text-sm font-black dark:border-white/10 dark:bg-ink-900"
    >
      {label}
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full border-2 transition ${
          checked ? 'border-brand-700 bg-brand-600' : 'border-ink-900/15 bg-ink-100 dark:border-white/15 dark:bg-ink-700'
        }`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
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
